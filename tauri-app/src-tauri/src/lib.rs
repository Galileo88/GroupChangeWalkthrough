// ============================================================
// IMPORTS
// ============================================================

use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use std::process::Command;
use tauri::Manager;
use tauri_plugin_dialog::DialogExt;

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

#[derive(Debug, Serialize, Deserialize)]
struct VersionInfo {
    version: String,
    exe_filename: String,
}

#[derive(Debug, Serialize)]
struct UpdateCheckResult {
    update_available: bool,
    current_version: String,
    latest_version: String,
    installer_path: Option<String>,
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

// -------------------- Auto-Update Commands --------------------

const CURRENT_VERSION: &str = "1.0.0";
const UPDATE_SHARE_PATH: &str = r"\\njtrfs1pv01.nj.core.him\shared\Provider Services\Enrollment\WALKTHROUGH_UPDATES";

#[tauri::command]
fn get_current_version() -> String {
    CURRENT_VERSION.to_string()
}

#[tauri::command]
async fn check_for_updates() -> Result<UpdateCheckResult, String> {
    let update_path = PathBuf::from(UPDATE_SHARE_PATH);
    let version_file = update_path.join("version.json");

    // Check if version file exists
    if !version_file.exists() {
        return Ok(UpdateCheckResult {
            update_available: false,
            current_version: CURRENT_VERSION.to_string(),
            latest_version: CURRENT_VERSION.to_string(),
            installer_path: None,
        });
    }

    // Read and parse version file
    let version_json = fs::read_to_string(&version_file)
        .map_err(|e| format!("Failed to read version file: {}", e))?;

    let version_info: VersionInfo = serde_json::from_str(&version_json)
        .map_err(|e| format!("Failed to parse version file: {}", e))?;

    // Compare versions (simple string comparison for now)
    let update_available = version_info.version != CURRENT_VERSION;

    let installer_path = if update_available {
        Some(update_path.join(&version_info.exe_filename).to_string_lossy().to_string())
    } else {
        None
    };

    Ok(UpdateCheckResult {
        update_available,
        current_version: CURRENT_VERSION.to_string(),
        latest_version: version_info.version,
        installer_path,
    })
}

#[tauri::command]
async fn download_and_install_update(app: tauri::AppHandle, installer_path: String) -> Result<String, String> {
    let new_exe = PathBuf::from(&installer_path);

    // Verify new exe exists
    if !new_exe.exists() {
        return Err(format!("Update file not found at: {}", installer_path));
    }

    // Get current exe path
    let current_exe = std::env::current_exe()
        .map_err(|e| format!("Failed to get current exe path: {}", e))?;

    // Copy new exe to temp directory
    let temp_dir = std::env::temp_dir();
    let temp_new_exe = temp_dir.join("provider-enrollment-walkthrough-update.exe");

    fs::copy(&new_exe, &temp_new_exe)
        .map_err(|e| format!("Failed to copy new exe to temp: {}", e))?;

    // Create updater batch script
    let updater_script = temp_dir.join("update-app.bat");
    let script_content = format!(
        r#"@echo off
REM Wait for the current app to close
timeout /t 2 /nobreak > nul

REM Replace old exe with new exe
copy /Y "{new_exe}" "{current_exe}"

REM Delete temp files
del "{temp_exe}"
del "%~f0"

REM Start the updated app
start "" "{current_exe}"
"#,
        new_exe = temp_new_exe.display(),
        current_exe = current_exe.display(),
        temp_exe = temp_new_exe.display()
    );

    fs::write(&updater_script, script_content)
        .map_err(|e| format!("Failed to create updater script: {}", e))?;

    // Launch updater script in background
    Command::new("cmd")
        .args(&["/C", "start", "/MIN", &updater_script.to_string_lossy()])
        .spawn()
        .map_err(|e| format!("Failed to launch updater: {}", e))?;

    // Exit the app to allow update
    app.exit(0);

    Ok("Update started".to_string())
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
        .invoke_handler(tauri::generate_handler![
            save_pwo_state,
            load_pwo_state,
            delete_pwo_state,
            get_save_location,
            open_url,
            save_file_dialog,
            save_file_to_pwo_folder,
            get_current_version,
            check_for_updates,
            download_and_install_update
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
