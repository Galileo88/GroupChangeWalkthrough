use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use tauri::Manager;
use tauri_plugin_dialog::DialogExt;

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

fn get_app_data_dir(app: &tauri::AppHandle) -> Result<PathBuf, String> {
    app.path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get app data directory: {}", e))
}

fn get_pwo_folder_path(app: &tauri::AppHandle, pwo_number: &str) -> Result<PathBuf, String> {
    let app_data_dir = get_app_data_dir(app)?;
    // PWO numbers already include "PWO" prefix, so use them as-is for folder names
    let pwo_folder = app_data_dir.join(pwo_number);
    Ok(pwo_folder)
}

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

#[tauri::command]
async fn save_file_dialog(app: tauri::AppHandle, content: String, default_filename: String) -> Result<String, String> {
    // Show save file dialog
    let file_path = app.dialog()
        .file()
        .set_file_name(&default_filename)
        .add_filter("Text Files", &["txt"])
        .blocking_save_file();

    match file_path {
        Some(path) => {
            // Write content to file
            fs::write(&path, content)
                .map_err(|e| format!("Failed to write file: {}", e))?;

            Ok(format!("File saved to: {}", path.display()))
        }
        None => Err("User cancelled save dialog".to_string())
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            save_pwo_state,
            load_pwo_state,
            delete_pwo_state,
            get_save_location,
            save_file_dialog
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
