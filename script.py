import os
import requests

# Helper function to download a file from GitHub
def download_file(url, save_path):
    try:
        response = requests.get(url)
        response.raise_for_status()
        with open(save_path, 'w', encoding='utf-8') as f:
            f.write(response.text)
        print(f"Downloaded: {save_path}")
    except requests.exceptions.RequestException as e:
        print(f"Failed to download {url}: {e}")

# Organize files into a structured directory
def organize_files(project_name, file_info):
    base_dir = os.path.join(os.getcwd(), project_name)

    # Download test files and organize with source files
    test_to_source = file_info.get('test_to_source', {})
    for test_url, source_urls in test_to_source.items():
        test_dir = os.path.join(base_dir, os.path.basename(test_url).replace('.py', ''))
        # test_dir = os.path.join(base_dir, os.path.basename(os.path.dirname(test_url)).replace('.py', ''))
        os.makedirs(test_dir, exist_ok=True)

        # Save the test file

        test_file_name = os.path.basename(test_url)
        test_save_path = os.path.join(test_dir, test_file_name)
        download_file(test_url, test_save_path)

        # Organize source files for the test
        source_dir = os.path.join(test_dir, "source_files")
        os.makedirs(source_dir, exist_ok=True)

        for source_url in source_urls:

            source_file_name = os.path.basename(source_url)
            source_save_path = os.path.join(source_dir, source_file_name)
            download_file(source_url, source_save_path)

        dependent_files = file_info.get('dependent_files', [])
        if dependent_files:
            # Organize dependent files in a separate directory
            dependent_dir = os.path.join(test_dir, "dependent_files")
            os.makedirs(dependent_dir, exist_ok=True)
            for dependent_url in dependent_files:

                dependent_file_name = os.path.basename(dependent_url)
                dependent_save_path = os.path.join(dependent_dir, dependent_file_name)
                download_file(dependent_url, dependent_save_path)

if __name__ == "__main__":
    # Example input: Replace with your filenames and GitHub raw URLs
    project_files = {
        "react-hook-form": {
            "test_to_source": {
                "https://raw.githubusercontent.com/react-hook-form/react-hook-form/refs/heads/master/src/__tests__/utils/isKey.test.ts": [
                    "https://raw.githubusercontent.com/react-hook-form/react-hook-form/refs/heads/master/src/utils/isKey.ts",
                    # "https://raw.githubusercontent.com/se2p/pynguin/refs/heads/main/tests/fixtures/programgraph/whileloop.py",
    
                ],
            },

            "dependent_files": [
                # "https://raw.githubusercontent.com/react-hook-form/react-hook-form/refs/heads/master/src/types/fields.ts",
                # "https://raw.githubusercontent.com/react-hook-form/react-hook-form/refs/heads/master/src/utils/isObject.ts",
                # "https://raw.githubusercontent.com/sodiray/radash/refs/heads/master/src/number.ts",
                # "https://raw.githubusercontent.com/gcanti/io-ts/refs/heads/master/src/Guard.ts",
                # "https://raw.githubusercontent.com/gcanti/io-ts/refs/heads/master/src/Kleisli.ts",
                # "https://raw.githubusercontent.com/gcanti/io-ts/refs/heads/master/src/Decoder.ts",
               
            ]
        },
    }

    for project_name, file_info in project_files.items():
        organize_files(project_name, file_info)
