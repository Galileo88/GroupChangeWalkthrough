// ============================================================
// IMPORTS
// ============================================================

use serde::{Deserialize, Serialize};
use std::fs;
use std::fs::File;
use std::io::Write;
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
    #[serde(rename = "file location")]
    file_location: String,
}

#[derive(Debug, Serialize)]
struct UpdateCheckResult {
    update_available: bool,
    current_version: String,
    latest_version: String,
    download_url: Option<String>,
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

const CURRENT_VERSION: &str = "1.0.0";
// TODO: Replace with your actual version.json hosting URL (can be OneDrive, GitHub, etc.)
// The version.json should contain: {"version": "1.0.5", "file location": "https://1drv.ms/u/..."}
const VERSION_JSON_URL: &str = "https://raw.githubusercontent.com/yourusername/updates/main/version.json";

fn convert_onedrive_link_to_direct_download(share_link: &str) -> String {
    // For OneDrive sharing links, we need to modify the URL for direct download

    // Method 1: If it's already a full onedrive.live.com URL
    if share_link.contains("onedrive.live.com") {
        // Replace 'redir' or 'embed' with 'download' if present
        let modified = share_link
            .replace("/redir?", "/download?")
            .replace("/embed?", "/download?");

        // If no query params yet, add ?download=1
        if !modified.contains("/download?") {
            if modified.contains('?') {
                return format!("{}&download=1", modified);
            } else {
                return format!("{}?download=1", modified);
            }
        }
        return modified;
    }

    // Method 2: For 1drv.ms short links, append download parameter
    // These will redirect to onedrive.live.com, so we add the parameter
    // that will be preserved through the redirect
    if share_link.contains("1drv.ms") {
        if share_link.contains('?') {
            return format!("{}&download=1", share_link);
        } else {
            return format!("{}?download=1", share_link);
        }
    }

    // For other URLs, return as-is
    share_link.to_string()
}

fn download_file_from_url(url: &str, destination: &PathBuf) -> Result<(), String> {
    let direct_url = convert_onedrive_link_to_direct_download(url);

    // Build a client that follows redirects (enabled by default)
    let client = reqwest::blocking::Client::builder()
        .redirect(reqwest::redirect::Policy::limited(10))
        .build()
        .map_err(|e| format!("Failed to create HTTP client: {}", e))?;

    let response = client.get(&direct_url)
        .send()
        .map_err(|e| format!("Failed to download file: {}", e))?;

    if !response.status().is_success() {
        return Err(format!("Download failed with status: {}. URL may be incorrect or not publicly accessible.", response.status()));
    }

    // Check content type - should be application/zip or application/octet-stream
    let content_type = response.headers()
        .get("content-type")
        .and_then(|v| v.to_str().ok())
        .unwrap_or("unknown");

    // If we got HTML, the link probably didn't work
    if content_type.contains("text/html") {
        return Err(format!(
            "Download failed: Received HTML instead of zip file. \
            OneDrive link may not be configured for direct download. \
            Please ensure the file is shared publicly and try using a different sharing link format."
        ));
    }

    let bytes = response.bytes()
        .map_err(|e| format!("Failed to read download bytes: {}", e))?;

    // Verify we got some data
    if bytes.is_empty() {
        return Err("Download failed: Received empty file".to_string());
    }

    // Check if it looks like a zip file (starts with PK signature)
    if bytes.len() < 4 || &bytes[0..2] != b"PK" {
        return Err(format!(
            "Download failed: File is not a valid zip archive (got {} bytes, content-type: {}). \
            The OneDrive sharing link may not be working correctly.",
            bytes.len(), content_type
        ));
    }

    let mut file = File::create(destination)
        .map_err(|e| format!("Failed to create file: {}", e))?;

    file.write_all(&bytes)
        .map_err(|e| format!("Failed to write file: {}", e))?;

    Ok(())
}

fn extract_zip(zip_path: &PathBuf, extract_to: &PathBuf) -> Result<PathBuf, String> {
    let file = File::open(zip_path)
        .map_err(|e| format!("Failed to open zip file: {}", e))?;

    let mut archive = zip::ZipArchive::new(file)
        .map_err(|e| format!("Failed to read zip archive: {}", e))?;

    fs::create_dir_all(extract_to)
        .map_err(|e| format!("Failed to create extraction directory: {}", e))?;

    let mut exe_path: Option<PathBuf> = None;

    for i in 0..archive.len() {
        let mut file = archive.by_index(i)
            .map_err(|e| format!("Failed to read file from archive: {}", e))?;

        let outpath = match file.enclosed_name() {
            Some(path) => extract_to.join(path),
            None => continue,
        };

        if file.name().ends_with('/') {
            fs::create_dir_all(&outpath)
                .map_err(|e| format!("Failed to create directory: {}", e))?;
        } else {
            if let Some(p) = outpath.parent() {
                if !p.exists() {
                    fs::create_dir_all(p)
                        .map_err(|e| format!("Failed to create parent directory: {}", e))?;
                }
            }
            let mut outfile = File::create(&outpath)
                .map_err(|e| format!("Failed to create output file: {}", e))?;

            std::io::copy(&mut file, &mut outfile)
                .map_err(|e| format!("Failed to extract file: {}", e))?;

            // Track the .exe file
            if outpath.extension().and_then(|s| s.to_str()) == Some("exe") {
                exe_path = Some(outpath);
            }
        }
    }

    exe_path.ok_or_else(|| "No .exe file found in the zip archive".to_string())
}

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

#[tauri::command]
fn get_current_version() -> String {
    CURRENT_VERSION.to_string()
}

#[tauri::command]
async fn check_for_updates() -> Result<UpdateCheckResult, String> {
    // Download version.json from the configured URL
    let response = reqwest::blocking::get(VERSION_JSON_URL)
        .map_err(|e| format!("Failed to check for updates: {}", e))?;

    if !response.status().is_success() {
        return Err(format!("Failed to fetch version info: {}", response.status()));
    }

    let version_json = response.text()
        .map_err(|e| format!("Failed to read version info: {}", e))?;

    let version_info: VersionInfo = serde_json::from_str(&version_json)
        .map_err(|e| format!("Failed to parse version file: {}", e))?;

    // Compare versions (simple string comparison)
    let update_available = version_info.version != CURRENT_VERSION;

    let download_url = if update_available {
        Some(version_info.file_location.clone())
    } else {
        None
    };

    Ok(UpdateCheckResult {
        update_available,
        current_version: CURRENT_VERSION.to_string(),
        latest_version: version_info.version,
        download_url,
    })
}

#[tauri::command]
async fn download_and_install_update(app: tauri::AppHandle, download_url: String, _current_version: String, _latest_version: String) -> Result<String, String> {
    // Get Downloads folder path
    let downloads_dir = dirs::download_dir()
        .ok_or_else(|| "Could not find Downloads folder".to_string())?;

    // Download zip to Downloads folder
    let zip_filename = format!("provider-enrollment-update-{}.zip", chrono::Utc::now().timestamp());
    let zip_path = downloads_dir.join(&zip_filename);

    download_file_from_url(&download_url, &zip_path)?;

    // Extract zip to temp folder
    let temp_dir = std::env::temp_dir();
    let extract_folder_name = format!("provider-enrollment-update-{}", chrono::Utc::now().timestamp());
    let extract_path = temp_dir.join(&extract_folder_name);

    let extracted_exe = extract_zip(&zip_path, &extract_path)?;

    // Get current exe path (where the app is running from)
    let current_exe = std::env::current_exe()
        .map_err(|e| format!("Failed to get current exe path: {}", e))?;

    // Get the current process ID
    let current_pid = std::process::id();

    // Create PowerShell updater script in temp
    let updater_script = temp_dir.join("updater.ps1");
    let script_content = format!(
        r#"# Wait for the application to close
Start-Sleep -Seconds 3

# Wait for process to fully exit
$processId = {pid}
$maxAttempts = 10
$attempts = 0
while ($attempts -lt $maxAttempts) {{
    $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
    if ($null -eq $process) {{
        break
    }}
    Start-Sleep -Seconds 1
    $attempts++
}}

# Replace the exe from extracted location to current location
try {{
    Copy-Item -Path "{extracted_exe}" -Destination "{current_exe}" -Force
    Write-Host "Update installed successfully"
}} catch {{
    Write-Host "Error installing update: $_"
    Read-Host "Press Enter to exit"
    exit 1
}}

# Start the updated application
Start-Process -FilePath "{current_exe}"

# Clean up downloaded zip and extracted folder
Start-Sleep -Seconds 2
Remove-Item -Path "{zip_path}" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "{extract_path}" -Recurse -Force -ErrorAction SilentlyContinue

# Clean up updater script
Remove-Item -Path $PSCommandPath -Force -ErrorAction SilentlyContinue
"#,
        pid = current_pid,
        extracted_exe = extracted_exe.to_string_lossy().replace('\\', "\\\\"),
        current_exe = current_exe.to_string_lossy().replace('\\', "\\\\"),
        zip_path = zip_path.to_string_lossy().replace('\\', "\\\\"),
        extract_path = extract_path.to_string_lossy().replace('\\', "\\\\")
    );

    fs::write(&updater_script, script_content)
        .map_err(|e| format!("Failed to create updater script: {}", e))?;

    // Launch PowerShell script in hidden window
    Command::new("powershell.exe")
        .args([
            "-WindowStyle", "Hidden",
            "-ExecutionPolicy", "Bypass",
            "-File", updater_script.to_string_lossy().as_ref()
        ])
        .spawn()
        .map_err(|e| format!("Failed to launch updater: {}", e))?;

    // Give the script a moment to start before exiting
    std::thread::sleep(std::time::Duration::from_millis(500));

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
