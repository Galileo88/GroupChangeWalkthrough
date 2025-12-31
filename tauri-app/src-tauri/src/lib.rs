// ============================================================
// IMPORTS
// ============================================================

use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use tauri::Manager;
use tauri_plugin_dialog::DialogExt;
use tauri_plugin_updater::UpdaterExt;

// ============================================================
// DATA STRUCTURES
// ============================================================

#[derive(Debug, Serialize, Deserialize)]
struct PwoState {
    pwo_number: String,
    user_name: String,
    current_page: String,
    form_data: serde_json::Value,
    enrolled_providers: Vec<serde_json::Value>,
    outreach_notes: serde_json::Value,
    provider_manual_notes: serde_json::Value,
    unable_to_verify_fields: Vec<String>,
    visited_pages: Vec<String>,
    current_enrolling_provider_index: i32,
    current_adding_provider_index: i32,
    last_saved: String,
    has_outreach: bool,
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

fn get_app_data_dir(_app: &tauri::AppHandle) -> Result<PathBuf, String> {
    // Use network path for PWO state storage
    Ok(PathBuf::from(r"\\njtrfs1pv01.nj.core.him\shared\Provider Services\Enrollment\WALKTHROUGH_PWOs"))
}

fn get_pwo_folder_path(app: &tauri::AppHandle, pwo_number: &str) -> Result<PathBuf, String> {
    let app_data_dir = get_app_data_dir(app)?;
    // PWO numbers already include "PWO" prefix, so use them as-is for folder names
    let pwo_folder = app_data_dir.join(pwo_number);
    Ok(pwo_folder)
}

// ============================================================
// TAURI COMMANDS
// ============================================================

// -------------------- State Management Commands --------------------

#[tauri::command]
fn save_pwo_state(app: tauri::AppHandle, state: PwoState) -> Result<String, String> {
    let pwo_folder = get_pwo_folder_path(&app, &state.pwo_number)?;

    // Create the PWO folder if it doesn't exist
    fs::create_dir_all(&pwo_folder)
        .map_err(|e| format!("Failed to create PWO folder: {}", e))?;

    // Save state to JSON file
    let state_file = pwo_folder.join("state.json");
    let json = serde_json::to_string_pretty(&state)
        .map_err(|e| format!("Failed to serialize state: {}", e))?;

    fs::write(&state_file, json)
        .map_err(|e| format!("Failed to write state file: {}", e))?;

    Ok(format!("State saved to: {}", pwo_folder.display()))
}

#[tauri::command]
fn load_pwo_state(app: tauri::AppHandle, pwo_number: String) -> Result<PwoState, String> {
    let pwo_folder = get_pwo_folder_path(&app, &pwo_number)?;
    let state_file = pwo_folder.join("state.json");

    if !state_file.exists() {
        return Err(format!("No saved state found for PWO #{}", pwo_number));
    }

    let json = fs::read_to_string(&state_file)
        .map_err(|e| format!("Failed to read state file: {}", e))?;

    let state: PwoState = serde_json::from_str(&json)
        .map_err(|e| format!("Failed to parse state file: {}", e))?;

    Ok(state)
}

#[tauri::command]
fn delete_pwo_state(app: tauri::AppHandle, pwo_number: String) -> Result<String, String> {
    let pwo_folder = get_pwo_folder_path(&app, &pwo_number)?;

    if !pwo_folder.exists() {
        return Ok(format!("No saved state found for PWO #{}", pwo_number));
    }

    fs::remove_dir_all(&pwo_folder)
        .map_err(|e| format!("Failed to delete PWO folder: {}", e))?;

    Ok(format!("Deleted saved state for PWO #{}", pwo_number))
}

#[tauri::command]
fn get_save_location(app: tauri::AppHandle) -> Result<String, String> {
    let app_data_dir = get_app_data_dir(&app)?;
    Ok(app_data_dir.to_string_lossy().to_string())
}

// -------------------- URL and File Operations --------------------

#[tauri::command]
async fn open_url(app: tauri::AppHandle, url: String) -> Result<(), String> {
    use tauri_plugin_opener::OpenerExt;

    // Handle PDF paths - they're bundled as resources
    if url.starts_with("./") && url.ends_with(".pdf") {
        let pdf_filename = url.trim_start_matches("./");

        // Get the resource directory where bundled PDFs are stored
        let resource_dir = app.path()
            .resource_dir()
            .map_err(|e| format!("Failed to get resource directory: {}", e))?;

        // Try to find the PDF in the resource directory
        let pdf_path = resource_dir.join(pdf_filename);

        // In dev mode, if not found in resource_dir, try the resources folder relative to src-tauri
        let pdf_path = if !pdf_path.exists() {
            // Try resources folder (for dev mode)
            let dev_resources = resource_dir
                .parent()
                .and_then(|p| p.parent())
                .map(|p| p.join("resources").join(pdf_filename));

            if let Some(dev_path) = dev_resources {
                if dev_path.exists() {
                    dev_path
                } else {
                    pdf_path // Keep original path for error message
                }
            } else {
                pdf_path
            }
        } else {
            pdf_path
        };

        if !pdf_path.exists() {
            return Err(format!(
                "PDF not found: {}. Searched in: {}. Please ensure the application was built with bundled resources.",
                pdf_filename,
                pdf_path.display()
            ));
        }

        // Use opener plugin's open_path for local files
        return app.opener()
            .open_path(pdf_path.to_string_lossy(), None::<String>)
            .map_err(|e| format!("Failed to open PDF: {}", e));
    } else if url.starts_with("http://") || url.starts_with("https://") {
        // Use opener plugin's open_url for web URLs
        return app.opener()
            .open_url(&url, None::<String>)
            .map_err(|e| format!("Failed to open URL: {}", e));
    } else {
        return Err(format!("Unsupported URL format: {}", url));
    }
}

#[tauri::command]
async fn save_file_dialog(app: tauri::AppHandle, content: String, default_filename: String) -> Result<String, String> {
    // Set default download directory to network path
    let default_dir = PathBuf::from(r"\\njtrfs1pv01.nj.core.him\shared\Provider Services\Enrollment\WALKTHROUGH_PWOs");

    // Show save file dialog
    let file_path = app.dialog()
        .file()
        .set_directory(&default_dir)
        .set_file_name(&default_filename)
        .add_filter("Text Files", &["txt"])
        .blocking_save_file();

    match file_path {
        Some(path) => {
            // Convert FilePath to PathBuf
            let path_buf = path.as_path()
                .ok_or_else(|| "Failed to get file path".to_string())?;

            // Write content to file
            fs::write(path_buf, content)
                .map_err(|e| format!("Failed to write file: {}", e))?;

            Ok(format!("File saved to: {}", path_buf.display()))
        }
        None => Err("User cancelled save dialog".to_string())
    }
}

#[tauri::command]
async fn save_file_to_pwo_folder(app: tauri::AppHandle, pwo_number: String, content: String, filename: String) -> Result<String, String> {
    let pwo_folder = get_pwo_folder_path(&app, &pwo_number)?;

    // Create the PWO folder if it doesn't exist
    fs::create_dir_all(&pwo_folder)
        .map_err(|e| format!("Failed to create PWO folder: {}", e))?;

    // Save file to PWO folder
    let file_path = pwo_folder.join(&filename);
    fs::write(&file_path, content)
        .map_err(|e| format!("Failed to write file to PWO folder: {}", e))?;

    Ok(format!("Copy saved to PWO folder: {}", file_path.display()))
}

// -------------------- Update Checker --------------------

#[tauri::command]
fn get_app_version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}

#[tauri::command]
async fn check_for_updates(app: tauri::AppHandle) -> Result<String, String> {
    let update = app.updater()
        .map_err(|e| {
            let error_msg = format!("{}", e);
            if error_msg.contains("404") || error_msg.contains("Not Found") {
                "No releases found. Please create a GitHub release with update files.".to_string()
            } else if error_msg.contains("minisign") {
                "Update check failed: Invalid signature data. This usually means no releases are published yet.".to_string()
            } else {
                format!("Failed to check for updates: {}", e)
            }
        })?
        .check()
        .await
        .map_err(|e| {
            let error_msg = format!("{}", e);
            if error_msg.contains("404") || error_msg.contains("Not Found") {
                "No releases found. Please create a GitHub release with update files.".to_string()
            } else if error_msg.contains("minisign") {
                "No releases available yet. The app will check for updates once releases are published.".to_string()
            } else {
                format!("Failed to check for updates: {}", e)
            }
        })?;

    if let Some(update) = update {
        let version = update.version;
        let current_version = update.current_version;

        Ok(format!("Update available: {} (current: {})", version, current_version))
    } else {
        Ok("You are running the latest version!".to_string())
    }
}

#[tauri::command]
async fn download_and_install_update(app: tauri::AppHandle) -> Result<String, String> {
    let update = app.updater()
        .map_err(|e| format!("Failed to get updater: {}", e))?
        .check()
        .await
        .map_err(|e| format!("Failed to check for updates: {}", e))?;

    if let Some(update) = update {
        update.download_and_install(|_chunk_length, _content_length| {
            // Progress callback - we could emit events here to show progress
        }, || {
            // Download complete callback
        })
        .await
        .map_err(|e| format!("Failed to download and install update: {}", e))?;

        Ok("Update downloaded and installed! Please restart the application.".to_string())
    } else {
        Ok("No updates available.".to_string())
    }
}

// ============================================================
// APPLICATION INITIALIZATION
// ============================================================

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(
            tauri_plugin_updater::Builder::new()
                .build()
        )
        .invoke_handler(tauri::generate_handler![
            save_pwo_state,
            load_pwo_state,
            delete_pwo_state,
            get_save_location,
            open_url,
            save_file_dialog,
            save_file_to_pwo_folder,
            get_app_version,
            check_for_updates,
            download_and_install_update
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
