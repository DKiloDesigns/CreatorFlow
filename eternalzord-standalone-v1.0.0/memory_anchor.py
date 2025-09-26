import json
import os
import datetime
import re

class MemoryAnchor:
    def __init__(self, data_dir=None):
        self.data_dir = data_dir or os.path.join(os.getcwd(), "data")
        self.state_file = os.path.join(self.data_dir, "dfai_state.json")
        self.anchor_file = os.path.join(self.data_dir, "state.md")
        self.context_entry_file = os.path.join(self.data_dir, "CONTEXT_ENTRY.md")
        
        # Ensure data directory exists
        os.makedirs(self.data_dir, exist_ok=True)

    def reload(self):
        """
        Reload state and anchor files, return as tuple.
        
        Returns:
            tuple: (state, anchor) where state is a dict and anchor is a string
            
        Raises:
            FileNotFoundError: If state or anchor file is not found
            json.JSONDecodeError: If state file is not valid JSON
        """
        try:
            with open(self.state_file, "r") as f:
                state = json.load(f)
        except FileNotFoundError:
            print(f"State file not found: {self.state_file}")
            # Create a default state file
            state = {
                "state_md_info": {
                    "version": "1.0.0",
                    "last_updated": datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
                    "links": [
                        "state.md",
                        "CONTEXT_ENTRY.md"
                    ],
                    "note": "This file is the machine-readable data brain for the agent. See state.md and CONTEXT_ENTRY.md for human/agent-readable context and navigation."
                },
                "schemaVersion": "1.0",
                "version": "1.0.0",
                "last_updated_utc": datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
                "_meta": {
                    "last_state_update_utc": datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
                    "last_updated_by": "EternalZord - Initial State Creation",
                    "notes": []
                }
            }
            
            # Write the default state file
            with open(self.state_file, "w") as f:
                json.dump(state, f, indent=2)
                
        except json.JSONDecodeError as e:
            print(f"Error parsing state file: {e}")
            raise
            
        try:
            with open(self.anchor_file, "r") as f:
                anchor = f.read()
        except FileNotFoundError:
            print(f"Anchor file not found: {self.anchor_file}")
            # Create a default anchor file
            anchor = f"""# DFAI State Anchor (state.md)

<!--
  This is the human/agent-readable anchor for DFAI sessions.
  Version: 1.0.0
  Last updated: {datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")}
  Cross-linked to: dfai_state.json, CONTEXT_ENTRY.md
-->

## Version & Timestamp
- **state.md version:** 1.0.0
- **Last updated:** {datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")}
- **dfai_state.json version:** 1.0

## Session Breadcrumbs (Last 3-5 Major Actions)
- [x] {datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")} — EternalZord initialized. Memory anchored.

## Persona Health Check
- **Persona:** EternalZord (active)
- **Status:** Initializing
- **Drift detected:** No

## Quick Actions / Session Commands
- **Reanchor:** Reload state and anchor files
  `POST /memory/reanchor`
- **Protocol Search:** Search for protocols by keyword or tags
  `GET /protocols/search?keyword=X&tags=Y`
- **Artifact Search:** Search for artifacts by keyword
  `GET /artifacts/search?keyword=X`
- **Session Info:** Get information about the current session
  `GET /session/info`
- **Update Breadcrumb:** Update a breadcrumb in state.md
  `POST /memory/update_breadcrumb`
- **Add Note:** Add a note to the state file
  `POST /memory/add_note`

## Current Focus
- **Primary Goal:** Initialize EternalZORD standalone instance
- **Status:** Setting up memory and knowledge systems
- **Next Steps:** Configure protocols and artifacts

## Notes
- EternalZORD standalone instance created
- Memory system initialized with default state
- Ready for protocol and artifact configuration
"""
            
            # Write the default anchor file
            with open(self.anchor_file, "w") as f:
                f.write(anchor)
                
        except Exception as e:
            print(f"Error creating anchor file: {e}")
            anchor = f"# DFAI State Anchor\n\nError creating anchor file: {e}"
            
        return state, anchor
        
    def get_breadcrumbs(self):
        """Get session breadcrumbs from state file"""
        try:
            with open(self.state_file, "r") as f:
                state = json.load(f)
            return state.get("breadcrumbs", [])
        except Exception as e:
            print(f"Error getting breadcrumbs: {e}")
            return []
            
    def get_persona(self):
        """Get current persona from state file"""
        try:
            with open(self.state_file, "r") as f:
                state = json.load(f)
            return state.get("current_persona", "SHAWN")
        except Exception as e:
            print(f"Error getting persona: {e}")
            return "SHAWN"
            
    def get_current_persona(self):
        """Get current persona name"""
        return self.get_persona()
        
    def set_current_persona(self, persona_name):
        """Set current persona in state file"""
        try:
            with open(self.state_file, "r") as f:
                state = json.load(f)
            
            state["current_persona"] = persona_name.upper()
            state["_meta"]["last_updated_by"] = f"EternalZord - Persona Change to {persona_name.upper()}"
            state["_meta"]["last_state_update_utc"] = datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
            
            with open(self.state_file, "w") as f:
                json.dump(state, f, indent=2)
                
            print(f"Persona changed to: {persona_name.upper()}")
            return True
        except Exception as e:
            print(f"Error setting persona: {e}")
            return False
            
    def add_breadcrumb(self, breadcrumb_text):
        """Add a new breadcrumb to state file"""
        try:
            with open(self.state_file, "r") as f:
                state = json.load(f)
            
            if "breadcrumbs" not in state:
                state["breadcrumbs"] = []
                
            new_breadcrumb = {
                "text": breadcrumb_text,
                "timestamp": datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
                "checked": False
            }
            
            state["breadcrumbs"].append(new_breadcrumb)
            
            # Keep only last 10 breadcrumbs
            if len(state["breadcrumbs"]) > 10:
                state["breadcrumbs"] = state["breadcrumbs"][-10:]
                
            state["_meta"]["last_updated_by"] = "EternalZord - Breadcrumb Added"
            state["_meta"]["last_state_update_utc"] = datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
            
            with open(self.state_file, "w") as f:
                json.dump(state, f, indent=2)
                
            print(f"Breadcrumb added: {breadcrumb_text}")
            return True
        except Exception as e:
            print(f"Error adding breadcrumb: {e}")
            return False
            
    def update_breadcrumb(self, index=0, checked=True, text=None):
        """Update a breadcrumb in state file"""
        try:
            with open(self.state_file, "r") as f:
                state = json.load(f)
            
            if "breadcrumbs" not in state or index >= len(state["breadcrumbs"]):
                print(f"Breadcrumb index {index} not found")
                return False
                
            breadcrumb = state["breadcrumbs"][index]
            breadcrumb["checked"] = checked
            
            if text is not None:
                breadcrumb["text"] = text
                
            state["_meta"]["last_updated_by"] = "EternalZord - Breadcrumb Updated"
            state["_meta"]["last_state_update_utc"] = datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
            
            with open(self.state_file, "w") as f:
                json.dump(state, f, indent=2)
                
            print(f"Breadcrumb {index} updated: checked={checked}, text={text or breadcrumb['text']}")
            return True
        except Exception as e:
            print(f"Error updating breadcrumb: {e}")
            return False
            
    def add_note_to_state(self, note_type, note_text):
        """Add a note to the state file"""
        try:
            with open(self.state_file, "r") as f:
                state = json.load(f)
            
            if "_meta" not in state:
                state["_meta"] = {}
            if "notes" not in state["_meta"]:
                state["_meta"]["notes"] = []
                
            new_note = {
                "type": note_type,
                "text": note_text,
                "timestamp": datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
            }
            
            state["_meta"]["notes"].append(new_note)
            
            # Keep only last 50 notes
            if len(state["_meta"]["notes"]) > 50:
                state["_meta"]["notes"] = state["_meta"]["notes"][-50:]
                
            state["_meta"]["last_updated_by"] = "EternalZord - Note Added"
            state["_meta"]["last_state_update_utc"] = datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
            
            with open(self.state_file, "w") as f:
                json.dump(state, f, indent=2)
                
            print(f"Note added: [{note_type}] {note_text}")
            return True
        except Exception as e:
            print(f"Error adding note: {e}")
            return False
            
    def get_state(self):
        """Get the current state"""
        try:
            with open(self.state_file, "r") as f:
                return json.load(f)
        except Exception as e:
            print(f"Error getting state: {e}")
            return {}