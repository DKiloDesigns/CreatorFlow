import sys, os
import datetime
import json
import time
import logging
from pathlib import Path

# Set up logging
def setup_logging(log_dir=None):
    if log_dir is None:
        log_dir = os.path.join(os.getcwd(), "logs")
    
    os.makedirs(log_dir, exist_ok=True)
    log_file = os.path.join(log_dir, "eternalzord.log")
    
    logging.basicConfig(
        filename=log_file,
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    # Add console handler for better debugging
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)
    console_formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    console_handler.setFormatter(console_formatter)
    logging.getLogger().addHandler(console_handler)

class EternalZord:
    def __init__(self, data_dir=None, log_dir=None):
        # Use configurable directories or defaults
        self.data_dir = data_dir or os.path.join(os.getcwd(), "data")
        self.log_dir = log_dir or os.path.join(os.getcwd(), "logs")
        
        # Ensure directories exist
        os.makedirs(self.data_dir, exist_ok=True)
        os.makedirs(self.log_dir, exist_ok=True)
        
        # Setup logging
        setup_logging(self.log_dir)
        
        # Import local modules
        from .protocol_registry import ProtocolRegistry
        from .memory_anchor import MemoryAnchor
        from .artifact_retriever import ArtifactRetriever
        
        self.protocols = ProtocolRegistry(data_dir=self.data_dir)
        self.memory = MemoryAnchor(data_dir=self.data_dir)
        self.artifacts = ArtifactRetriever(data_dir=self.data_dir)
        
        self.last_reanchor = None
        self.last_reanchor_time = 0
        self.session_start = datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
        
        logging.info("EternalZORD standalone instance initialized")
        print(f"🚀 EternalZORD Standalone initialized at {datetime.datetime.utcnow()}")
        
    def reanchor(self):
        """Reload state and anchor files, update timestamps"""
        import traceback
        now = time.time()
        # Throttle: only allow reanchor once every 10 seconds
        if now - self.last_reanchor_time < 10:
            print(f"[ETERNALZORD] Reanchor throttled. Caller info:")
            try:
                import inspect
                stack = traceback.format_stack()
                print("\n".join(stack[-5:]))
            except Exception as e:
                print(f"[ETERNALZORD] Failed to print stack trace: {e}")
            return "throttled", None
        
        state, anchor = self.memory.reload()
        self.last_reanchor = datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
        self.last_reanchor_time = now
        
        # Log the reanchor
        self.memory.add_note_to_state("JAM", f"EternalZord memory reanchored. Breadcrumbs: {len(self.get_breadcrumbs())}, Persona: {self.get_persona()}")
        
        print(f"I AM ETERNAL. State and anchor reloaded at {self.last_reanchor}.")
        return state, anchor
        
    def fetch_protocol(self, keyword=None, tags=None):
        """Search for protocols by keyword or tags"""
        return self.protocols.search(keyword=keyword, tags=tags)
        
    def fetch_artifacts(self, keyword):
        """Search for artifacts by keyword"""
        return self.artifacts.search(keyword)
        
    def get_breadcrumbs(self):
        """Get session breadcrumbs"""
        return self.memory.get_breadcrumbs()
        
    def get_persona(self):
        """Get current persona"""
        return self.memory.get_persona()
        
    def update_breadcrumb(self, index=0, checked=True, text=None):
        """Update a breadcrumb"""
        return self.memory.update_breadcrumb(index, checked, text)
        
    def add_note(self, note_type, note_text):
        """Add a note to the state"""
        return self.memory.add_note_to_state(note_type, note_text)
        
    def get_session_info(self):
        """Get session information"""
        return {
            "session_start": self.session_start,
            "last_reanchor": self.last_reanchor,
            "breadcrumbs": self.get_breadcrumbs(),
            "persona": self.get_persona(),
            "data_dir": self.data_dir,
            "log_dir": self.log_dir
        }
        
    def archive_state(self):
        """Archive current state"""
        timestamp = datetime.datetime.utcnow().strftime("%Y%m%d_%H%M%S")
        archive_file = os.path.join(self.data_dir, f"state_archive_{timestamp}.json")
        
        state_data = {
            "timestamp": timestamp,
            "session_info": self.get_session_info(),
            "state": self.memory.get_state(),
            "breadcrumbs": self.get_breadcrumbs(),
            "persona": self.get_persona()
        }
        
        with open(archive_file, 'w') as f:
            json.dump(state_data, f, indent=2)
            
        print(f"State archived to: {archive_file}")
        return archive_file

# FastAPI app setup
from fastapi import FastAPI, Request, Query, HTTPException, UploadFile, File, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(
    title="EternalZORD Standalone",
    description="Standalone memory and knowledge management system",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global EternalZORD instance
ez_instance = None

def get_ez_instance():
    global ez_instance
    if ez_instance is None:
        # Get config from environment or use defaults
        data_dir = os.getenv("EZ_DATA_DIR", os.path.join(os.getcwd(), "data"))
        log_dir = os.getenv("EZ_LOG_DIR", os.path.join(os.getcwd(), "logs"))
        ez_instance = EternalZord(data_dir=data_dir, log_dir=log_dir)
    return ez_instance

@app.get("/health")
def health():
    return {"status": "ok", "service": "eternalzord-standalone", "timestamp": datetime.datetime.utcnow().isoformat()}

@app.post("/memory/reanchor")
@app.get("/memory/reanchor")
def memory_reanchor():
    """Reanchor memory - reload state and anchor files"""
    try:
        ez = get_ez_instance()
        state, anchor = ez.reanchor()
        
        if state == "throttled":
            return JSONResponse(
                status_code=429,
                content={"error": "Reanchor throttled", "message": "Wait 10 seconds between reanchor calls"}
            )
        
        return {
            "status": "ok",
            "timestamp": datetime.datetime.utcnow().isoformat(),
            "persona": ez.get_persona(),
            "breadcrumbs": ez.get_breadcrumbs(),
            "shc_context": "EternalZORD Standalone Instance",
            "message": "Memory reanchored successfully"
        }
    except Exception as e:
        logging.error(f"Error in memory_reanchor: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/memory/state")
def get_state():
    """Get current state"""
    try:
        ez = get_ez_instance()
        return {
            "status": "ok",
            "state": ez.memory.get_state(),
            "timestamp": datetime.datetime.utcnow().isoformat()
        }
    except Exception as e:
        logging.error(f"Error getting state: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/memory/search")
def memory_search(q: str = Query(..., description="Search query")):
    """Search memory and artifacts"""
    try:
        ez = get_ez_instance()
        results = ez.artifacts.search(q)
        return {
            "status": "ok",
            "query": q,
            "results": results,
            "count": len(results)
        }
    except Exception as e:
        logging.error(f"Error in memory_search: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/memory/persona")
def get_persona(name: str = Query("SHAWN", description="Persona name")):
    """Get persona information"""
    try:
        ez = get_ez_instance()
        return {
            "status": "ok",
            "persona": ez.get_persona(),
            "timestamp": datetime.datetime.utcnow().isoformat()
        }
    except Exception as e:
        logging.error(f"Error getting persona: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/memory/semantic_search")
def memory_semantic_search(q: str = Query(..., description="Semantic search query")):
    """Semantic search through memory"""
    try:
        ez = get_ez_instance()
        # For now, use regular search - semantic search can be added later
        results = ez.artifacts.search(q)
        return {
            "status": "ok",
            "query": q,
            "results": results,
            "count": len(results),
            "note": "Using keyword search - semantic search coming soon"
        }
    except Exception as e:
        logging.error(f"Error in semantic_search: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/session/info")
def session_info():
    """Get session information"""
    try:
        ez = get_ez_instance()
        return {
            "status": "ok",
            "session_info": ez.get_session_info(),
            "timestamp": datetime.datetime.utcnow().isoformat()
        }
    except Exception as e:
        logging.error(f"Error getting session info: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/memory/add_note")
async def memory_add_note(request: Request):
    """Add a note to memory"""
    try:
        data = await request.json()
        note_type = data.get("type", "GENERAL")
        note_text = data.get("text", "")
        
        ez = get_ez_instance()
        ez.add_note(note_type, note_text)
        
        return {
            "status": "ok",
            "message": "Note added successfully",
            "note_type": note_type,
            "timestamp": datetime.datetime.utcnow().isoformat()
        }
    except Exception as e:
        logging.error(f"Error adding note: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/memory/archive")
def memory_archive():
    """Archive current memory state"""
    try:
        ez = get_ez_instance()
        archive_file = ez.archive_state()
        return {
            "status": "ok",
            "message": "State archived successfully",
            "archive_file": archive_file,
            "timestamp": datetime.datetime.utcnow().isoformat()
        }
    except Exception as e:
        logging.error(f"Error archiving state: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

def main():
    """Main function for console script entry point"""
    import argparse
    
    parser = argparse.ArgumentParser(description="EternalZORD Standalone Server")
    parser.add_argument("--host", default="0.0.0.0", help="Host to bind to")
    parser.add_argument("--port", type=int, default=7010, help="Port to bind to")
    parser.add_argument("--data-dir", help="Data directory path")
    parser.add_argument("--log-dir", help="Log directory path")
    
    args = parser.parse_args()
    
    # Set environment variables if provided
    if args.data_dir:
        os.environ["EZ_DATA_DIR"] = args.data_dir
    if args.log_dir:
        os.environ["EZ_LOG_DIR"] = args.log_dir
    
    print(f"🚀 Starting EternalZORD Standalone on {args.host}:{args.port}")
    print(f"📁 Data directory: {os.getenv('EZ_DATA_DIR', os.path.join(os.getcwd(), 'data'))}")
    print(f"📝 Log directory: {os.getenv('EZ_LOG_DIR', os.path.join(os.getcwd(), 'logs'))}")
    
    uvicorn.run(app, host=args.host, port=args.port)

if __name__ == "__main__":
    main()