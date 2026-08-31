import os
import zipfile

def zip_project(source_dir, output_filename):
    # Items to skip completely
    excludes = {
        'node_modules', 'target', '.next', 'out', 'dist', 'build', 
        'playwright-report', 'test-results', '__pycache__'
    }
    
    with zipfile.ZipFile(output_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(source_dir):
            # Modify dirs in-place to prune the traversal of excluded directories
            dirs[:] = [d for d in dirs if d not in excludes]
            
            for file in files:
                # Don't zip the output zip if it happens to be inside
                if file.endswith('.zip'):
                    continue
                    
                file_path = os.path.join(root, file)
                # Ensure we handle the path nicely for the zip inside
                arcname = os.path.relpath(file_path, start=source_dir)
                zipf.write(file_path, arcname)

if __name__ == '__main__':
    source = os.path.dirname(os.path.abspath(__file__))
    out_zip = os.path.join(os.path.dirname(source), 'smart-communication-crm-fixed.zip')
    print(f"Creating zip {out_zip} from {source}...")
    zip_project(source, out_zip)
    print("Zip created successfully.")
