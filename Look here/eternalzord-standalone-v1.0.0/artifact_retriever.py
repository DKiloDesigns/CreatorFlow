import glob
import os

class ArtifactRetriever:
    def __init__(self, data_dir=None):
        self.data_dir = data_dir or os.path.join(os.getcwd(), "data")
        
        # Default artifact directories relative to data_dir
        self.artifact_dirs = [
            os.path.join(self.data_dir, "artifacts"),
            os.path.join(self.data_dir, "protocols"),
            os.path.join(self.data_dir, "knowledge"),
            os.path.join(self.data_dir, "docs")
        ]
        
        # Ensure artifact directories exist
        for d in self.artifact_dirs:
            os.makedirs(d, exist_ok=True)

    def search(self, keyword):
        """
        Search for artifacts containing the keyword.
        
        Args:
            keyword (str): Keyword to search for in artifact content.
            
        Returns:
            list: List of matching artifacts. Each artifact is a dict with keys:
                - file: Path to the artifact file
                - title: Artifact title (extracted from first heading or filename)
                - snippet: Context around the keyword
                - last_modified: Last modified timestamp
                - type: Type of artifact
                - path: Path to the artifact file (relative to data directory)
        """
        results = []
        
        # If no keyword provided, return empty list
        if not keyword or not keyword.strip():
            return results
            
        keyword = keyword.lower().strip()
        
        for d in self.artifact_dirs:
            if not os.path.exists(d):
                continue
                
            # Search for markdown files
            for file in glob.glob(os.path.join(d, "*.md")):
                try:
                    with open(file, "r") as f:
                        content = f.read()
                        if keyword in content.lower():
                            # Extract title from first line if it's a markdown heading
                            lines = content.split('\n')
                            title = os.path.basename(file)
                            if lines and lines[0].startswith('# '):
                                title = lines[0][2:].strip()
                            
                            # Find the context around the keyword
                            keyword_pos = content.lower().find(keyword)
                            start = max(0, keyword_pos - 100)
                            end = min(len(content), keyword_pos + 100)
                            
                            # Try to find complete sentences or paragraphs
                            while start > 0 and content[start] not in ['.', '!', '?', '\n']:
                                start -= 1
                            
                            while end < len(content) and content[end] not in ['.', '!', '?', '\n']:
                                end += 1
                                
                            # Add a bit more context
                            start = max(0, start - 10)
                            end = min(len(content), end + 10)
                            
                            context = content[start:end]
                            
                            # Highlight the keyword in the context
                            context_lower = context.lower()
                            keyword_start = context_lower.find(keyword)
                            if keyword_start != -1:
                                keyword_end = keyword_start + len(keyword)
                                context = context[:keyword_start] + "**" + context[keyword_start:keyword_end] + "**" + context[keyword_end:]
                            
                            # Get last modified time
                            last_modified = os.path.getmtime(file)
                            
                            # Get relative path from data directory
                            rel_path = os.path.relpath(file, self.data_dir)
                            
                            results.append({
                                "file": file,
                                "title": title,
                                "snippet": context,
                                "last_modified": last_modified,
                                "type": self._get_artifact_type(file),
                                "path": rel_path
                            })
                except Exception as e:
                    print(f"Error reading file {file}: {str(e)}")
                    continue
        
        # Sort by last modified time, newest first
        results.sort(key=lambda x: x["last_modified"], reverse=True)
        
        return results
        
    def _get_artifact_type(self, file_path):
        """Determine the type of artifact based on file path"""
        filename = os.path.basename(file_path).lower()
        
        if "protocol" in filename or "protocol" in file_path.lower():
            return "protocol"
        elif "kra" in filename or "knowledge" in filename:
            return "knowledge"
        elif "doc" in filename or "readme" in filename:
            return "documentation"
        elif "config" in filename or "setup" in filename:
            return "configuration"
        else:
            return "artifact"
            
    def add_artifact(self, file_path, content, artifact_type="artifact"):
        """
        Add a new artifact to the appropriate directory.
        
        Args:
            file_path (str): Path where the artifact should be stored
            content (str): Content of the artifact
            artifact_type (str): Type of artifact (protocol, knowledge, documentation, etc.)
        """
        try:
            # Determine the appropriate directory based on type
            if artifact_type == "protocol":
                target_dir = os.path.join(self.data_dir, "protocols")
            elif artifact_type == "knowledge":
                target_dir = os.path.join(self.data_dir, "knowledge")
            elif artifact_type == "documentation":
                target_dir = os.path.join(self.data_dir, "docs")
            else:
                target_dir = os.path.join(self.data_dir, "artifacts")
                
            # Ensure target directory exists
            os.makedirs(target_dir, exist_ok=True)
            
            # Create the full file path
            full_path = os.path.join(target_dir, file_path)
            
            # Ensure the directory for the file exists
            os.makedirs(os.path.dirname(full_path), exist_ok=True)
            
            # Write the artifact
            with open(full_path, "w") as f:
                f.write(content)
                
            print(f"Artifact added: {full_path}")
            return True
            
        except Exception as e:
            print(f"Error adding artifact: {e}")
            return False
            
    def list_artifacts(self, artifact_type=None):
        """
        List all artifacts, optionally filtered by type.
        
        Args:
            artifact_type (str, optional): Filter by artifact type
            
        Returns:
            list: List of artifact information
        """
        artifacts = []
        
        for d in self.artifact_dirs:
            if not os.path.exists(d):
                continue
                
            for file in glob.glob(os.path.join(d, "*.md")):
                try:
                    file_type = self._get_artifact_type(file)
                    
                    # Filter by type if specified
                    if artifact_type and file_type != artifact_type:
                        continue
                        
                    rel_path = os.path.relpath(file, self.data_dir)
                    
                    artifacts.append({
                        "file": file,
                        "path": rel_path,
                        "type": file_type,
                        "last_modified": os.path.getmtime(file),
                        "size": os.path.getsize(file)
                    })
                except Exception as e:
                    print(f"Error processing file {file}: {e}")
                    continue
                    
        # Sort by last modified time, newest first
        artifacts.sort(key=lambda x: x["last_modified"], reverse=True)
        
        return artifacts