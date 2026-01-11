use std::process::Command;
use tauri::Manager;

#[tauri::command]
fn get_app_dir(app: tauri::AppHandle) -> Result<String, String> {
    let resource_path = app.path().resource_dir()
        .map_err(|e| e.to_string())?;
    Ok(resource_path.to_string_lossy().to_string())
}

#[tauri::command]
fn read_projects_json(app: tauri::AppHandle) -> Result<String, String> {
    let resource_path = app.path().resource_dir()
        .map_err(|e| e.to_string())?;
    let projects_path = resource_path.join("data").join("projects.json");
    std::fs::read_to_string(&projects_path)
        .map_err(|e| format!("Fehler beim Lesen von projects.json: {}", e))
}

#[tauri::command]
fn read_solution_file(app: tauri::AppHandle, filename: String) -> Result<String, String> {
    let resource_path = app.path().resource_dir()
        .map_err(|e| e.to_string())?;
    let solution_path = resource_path.join("solutions").join(&filename);
    std::fs::read_to_string(&solution_path)
        .map_err(|e| format!("Fehler beim Lesen von {}: {}", filename, e))
}

#[tauri::command]
fn save_generated_code(app: tauri::AppHandle, filename: String, code: String) -> Result<String, String> {
    let resource_path = app.path().resource_dir()
        .map_err(|e| e.to_string())?;
    let output_dir = resource_path.join("output");

    // Erstelle output-Ordner falls nicht vorhanden
    std::fs::create_dir_all(&output_dir)
        .map_err(|e| format!("Fehler beim Erstellen des output-Ordners: {}", e))?;

    let file_path = output_dir.join(&filename);
    std::fs::write(&file_path, &code)
        .map_err(|e| format!("Fehler beim Speichern: {}", e))?;

    Ok(file_path.to_string_lossy().to_string())
}

#[tauri::command]
fn open_in_arduino_ide(app: tauri::AppHandle, file_path: String) -> Result<(), String> {
    let resource_path = app.path().resource_dir()
        .map_err(|e| e.to_string())?;
    let ide_path = resource_path.join("arduino-ide").join("ArduinoPortable.exe");

    if !ide_path.exists() {
        return Err("Arduino IDE nicht gefunden. Bitte stellen Sie sicher, dass die portable Arduino IDE im Ordner 'arduino-ide' liegt.".to_string());
    }

    Command::new(&ide_path)
        .arg(&file_path)
        .spawn()
        .map_err(|e| format!("Fehler beim Starten der Arduino IDE: {}", e))?;

    Ok(())
}

#[tauri::command]
fn open_solution_in_ide(app: tauri::AppHandle, filename: String) -> Result<(), String> {
    let resource_path = app.path().resource_dir()
        .map_err(|e| e.to_string())?;
    let solution_path = resource_path.join("solutions").join(&filename);
    let ide_path = resource_path.join("arduino-ide").join("ArduinoPortable.exe");

    if !ide_path.exists() {
        return Err("Arduino IDE nicht gefunden.".to_string());
    }

    if !solution_path.exists() {
        return Err(format!("Lösung {} nicht gefunden.", filename));
    }

    Command::new(&ide_path)
        .arg(&solution_path)
        .spawn()
        .map_err(|e| format!("Fehler beim Starten der Arduino IDE: {}", e))?;

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_app_dir,
            read_projects_json,
            read_solution_file,
            save_generated_code,
            open_in_arduino_ide,
            open_solution_in_ide
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
