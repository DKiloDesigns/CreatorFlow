import os
import yaml
import glob
from typing import List, Dict, Any

"""
Automated CLI JAM Startup Protocol (2025-05-18):
- All protocol initialization and registry operations must follow the CLI-first, background, chained, and logged batch pattern as defined in shc_context.md and JAM protocol.
- See: docs/shc_context.md#shc-chunk-automated-cli-jam-startup-protocol-2025-05-18
- See: docs/_shc_refactor_v0.1/chunks/si_workflow_jam_protocol.md
"""

class ProtocolRegistry:
    def __init__(self, data_dir=None):
        self.data_dir = data_dir or os.path.join(os.getcwd(), "data")
        self.protocols_dir = os.path.join(self.data_dir, "protocols")
        self.protocols = {}
        
        # Ensure protocols directory exists
        os.makedirs(self.protocols_dir, exist_ok=True)
        
        # Load existing protocols
        self._load_protocols()
        
    def _load_protocols(self):
        """Load all protocols from the protocols directory"""
        if not os.path.exists(self.protocols_dir):
            return
            
        for protocol_file in glob.glob(os.path.join(self.protocols_dir, "*.md")):
            try:
                protocol_data = self._parse_protocol_file(protocol_file)
                if protocol_data:
                    protocol_name = os.path.basename(protocol_file).replace(".md", "")
                    self.protocols[protocol_name] = protocol_data
            except Exception as e:
                print(f"Error loading protocol {protocol_file}: {e}")
                
    def _parse_protocol_file(self, file_path: str) -> Dict[str, Any]:
        """Parse a protocol markdown file and extract metadata"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # Extract basic metadata
            protocol_data = {
                "file_path": file_path,
                "content": content,
                "title": os.path.basename(file_path).replace(".md", ""),
                "tags": [],
                "priority": "medium",
                "status": "active"
            }
            
            # Try to extract YAML frontmatter if present
            if content.startswith("---"):
                try:
                    # Find the end of YAML frontmatter
                    end_marker = content.find("---", 3)
                    if end_marker != -1:
                        yaml_content = content[3:end_marker]
                        yaml_data = yaml.safe_load(yaml_content)
                        if yaml_data:
                            protocol_data.update(yaml_data)
                except Exception as e:
                    print(f"Error parsing YAML frontmatter in {file_path}: {e}")
                    
            # Extract tags from content if not in frontmatter
            if not protocol_data.get("tags"):
                # Look for tag patterns in content
                lines = content.split('\n')
                for line in lines:
                    if line.strip().startswith("**Tags:**"):
                        tags_text = line.replace("**Tags:**", "").strip()
                        protocol_data["tags"] = [tag.strip() for tag in tags_text.split(",")]
                        break
                        
            return protocol_data
            
        except Exception as e:
            print(f"Error parsing protocol file {file_path}: {e}")
            return None
            
    def search(self, keyword: str = None, tags: List[str] = None) -> List[Dict[str, Any]]:
        """
        Search for protocols by keyword or tags.
        
        Args:
            keyword (str, optional): Keyword to search for in protocol content
            tags (List[str], optional): Tags to filter by
            
        Returns:
            List[Dict]: List of matching protocols
        """
        results = []
        
        for protocol_name, protocol_data in self.protocols.items():
            match = True
            
            # Filter by keyword
            if keyword:
                keyword_lower = keyword.lower()
                content_lower = protocol_data.get("content", "").lower()
                title_lower = protocol_data.get("title", "").lower()
                
                if (keyword_lower not in content_lower and 
                    keyword_lower not in title_lower):
                    match = False
                    
            # Filter by tags
            if tags and match:
                protocol_tags = protocol_data.get("tags", [])
                if not any(tag.lower() in [pt.lower() for pt in protocol_tags] for tag in tags):
                    match = False
                    
            if match:
                results.append(protocol_data)
                
        # Sort by priority and title
        priority_order = {"high": 3, "medium": 2, "low": 1}
        results.sort(key=lambda x: (
            priority_order.get(x.get("priority", "medium"), 2),
            x.get("title", "").lower()
        ), reverse=True)
        
        return results
        
    def get_protocol(self, protocol_name: str) -> Dict[str, Any]:
        """
        Get a specific protocol by name.
        
        Args:
            protocol_name (str): Name of the protocol to retrieve
            
        Returns:
            Dict: Protocol data or None if not found
        """
        return self.protocols.get(protocol_name)
        
    def add_protocol(self, protocol_name: str, content: str, metadata: Dict[str, Any] = None) -> bool:
        """
        Add a new protocol to the registry.
        
        Args:
            protocol_name (str): Name of the protocol
            content (str): Protocol content (markdown)
            metadata (Dict, optional): Additional metadata
            
        Returns:
            bool: True if successful, False otherwise
        """
        try:
            # Prepare protocol data
            protocol_data = {
                "title": protocol_name,
                "content": content,
                "tags": metadata.get("tags", []) if metadata else [],
                "priority": metadata.get("priority", "medium") if metadata else "medium",
                "status": metadata.get("status", "active") if metadata else "active",
                "created_at": self._get_timestamp()
            }
            
            # Create file path
            file_path = os.path.join(self.protocols_dir, f"{protocol_name}.md")
            
            # Write protocol file
            with open(file_path, 'w', encoding='utf-8') as f:
                # Write YAML frontmatter
                f.write("---\n")
                f.write(f"title: {protocol_name}\n")
                f.write(f"priority: {protocol_data['priority']}\n")
                f.write(f"status: {protocol_data['status']}\n")
                f.write(f"created_at: {protocol_data['created_at']}\n")
                if protocol_data['tags']:
                    f.write(f"tags: {', '.join(protocol_data['tags'])}\n")
                f.write("---\n\n")
                
                # Write content
                f.write(content)
                
            # Add to in-memory registry
            protocol_data["file_path"] = file_path
            self.protocols[protocol_name] = protocol_data
            
            print(f"Protocol added: {protocol_name}")
            return True
            
        except Exception as e:
            print(f"Error adding protocol {protocol_name}: {e}")
            return False
            
    def update_protocol(self, protocol_name: str, content: str = None, metadata: Dict[str, Any] = None) -> bool:
        """
        Update an existing protocol.
        
        Args:
            protocol_name (str): Name of the protocol to update
            content (str, optional): New content
            metadata (Dict, optional): Updated metadata
            
        Returns:
            bool: True if successful, False otherwise
        """
        if protocol_name not in self.protocols:
            print(f"Protocol {protocol_name} not found")
            return False
            
        try:
            protocol_data = self.protocols[protocol_name]
            
            # Update content if provided
            if content:
                protocol_data["content"] = content
                
            # Update metadata if provided
            if metadata:
                for key, value in metadata.items():
                    if key in ["tags", "priority", "status"]:
                        protocol_data[key] = value
                        
            # Update timestamp
            protocol_data["updated_at"] = self._get_timestamp()
            
            # Write updated file
            file_path = protocol_data["file_path"]
            with open(file_path, 'w', encoding='utf-8') as f:
                # Write YAML frontmatter
                f.write("---\n")
                f.write(f"title: {protocol_data['title']}\n")
                f.write(f"priority: {protocol_data['priority']}\n")
                f.write(f"status: {protocol_data['status']}\n")
                f.write(f"created_at: {protocol_data['created_at']}\n")
                if "updated_at" in protocol_data:
                    f.write(f"updated_at: {protocol_data['updated_at']}\n")
                if protocol_data['tags']:
                    f.write(f"tags: {', '.join(protocol_data['tags'])}\n")
                f.write("---\n\n")
                
                # Write content
                f.write(protocol_data["content"])
                
            print(f"Protocol updated: {protocol_name}")
            return True
            
        except Exception as e:
            print(f"Error updating protocol {protocol_name}: {e}")
            return False
            
    def remove_protocol(self, protocol_name: str) -> bool:
        """
        Remove a protocol from the registry.
        
        Args:
            protocol_name (str): Name of the protocol to remove
            
        Returns:
            bool: True if successful, False otherwise
        """
        if protocol_name not in self.protocols:
            print(f"Protocol {protocol_name} not found")
            return False
            
        try:
            protocol_data = self.protocols[protocol_name]
            file_path = protocol_data["file_path"]
            
            # Remove file
            if os.path.exists(file_path):
                os.remove(file_path)
                
            # Remove from in-memory registry
            del self.protocols[protocol_name]
            
            print(f"Protocol removed: {protocol_name}")
            return True
            
        except Exception as e:
            print(f"Error removing protocol {protocol_name}: {e}")
            return False
            
    def list_protocols(self, status: str = None) -> List[Dict[str, Any]]:
        """
        List all protocols, optionally filtered by status.
        
        Args:
            status (str, optional): Filter by status (active, inactive, draft)
            
        Returns:
            List[Dict]: List of protocol information
        """
        results = []
        
        for protocol_name, protocol_data in self.protocols.items():
            if status and protocol_data.get("status") != status:
                continue
                
            results.append({
                "name": protocol_name,
                "title": protocol_data.get("title", protocol_name),
                "tags": protocol_data.get("tags", []),
                "priority": protocol_data.get("priority", "medium"),
                "status": protocol_data.get("status", "active"),
                "created_at": protocol_data.get("created_at"),
                "updated_at": protocol_data.get("updated_at")
            })
            
        # Sort by priority and title
        priority_order = {"high": 3, "medium": 2, "low": 1}
        results.sort(key=lambda x: (
            priority_order.get(x.get("priority", "medium"), 2),
            x.get("title", "").lower()
        ), reverse=True)
        
        return results
        
    def _get_timestamp(self) -> str:
        """Get current timestamp in ISO format"""
        from datetime import datetime
        return datetime.utcnow().isoformat() 