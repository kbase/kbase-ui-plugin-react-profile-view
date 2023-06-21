# React User Profile View as a Plugin

Profile view and edit page as a KBase-UI Plugin.
https://narrative.kbase.us/#people

Tech Stack:

    - React with create react app
    - Redux
    - TypeScript
    - Enzyme (testing)
    - AntDesign

## Usage

Edit user profile or serach other users' profile. 

## Install and run

Create a project folder and clone the repo and KBase-UI https://github.com/kbase/kbase-ui to the same folder.

Navigate to this repo's folder and run

    ```bash
    npm run build
    ```

Navigate to kbase-ui folder and run:

    ```bash
    make dev-start plugins="react-profile-view" build-image=t
    ```

More details on running Kbase-UI and plugins in KBase-UI docs.

## See Also

https://kbaseincubator.github.io/kbase-ui-docs/

## License

SEE LICENSE IN LICENSE.md