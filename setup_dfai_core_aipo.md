# Setting Up DFAI Core (AIPO) in a New Project

This guide provides the command-line instructions to pull the core DFAI/AIPO components into a new project.

**Prerequisites:**
- Git installed on your system.
- An empty directory for your new project.

**Instructions:**

1.  Open your terminal and navigate (`cd`) into your **new, empty project directory**.

2.  Run the following command to clone the dedicated AIPO core repository:

    ```sh
    git clone https://github.com/oliksueddaht/aipo-core.git
    ```

**Result:**

-   This will create an `aipo-core/` directory inside your project.
-   This directory contains the latest DFAI core files (SHC chunks, protocols, AIPO communication structure).
-   You are now ready to integrate these components into your project's build process or workflow as needed.

**Getting Future Updates:**

To update your local copy of the AIPO core with the latest changes:

1.  Navigate into the `aipo-core/` directory within your project:
    ```sh
    cd aipo-core
    ```
2.  Pull the latest changes from the remote repository:
    ```sh
    git pull origin main
    ```

**Reference:**
- For a conceptual overview, see the `README.md` inside the `aipo-core` directory or the `si_core_aipo.md` SHC chunk. 