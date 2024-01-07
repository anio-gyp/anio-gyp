# anio-gyp

```
Usage: anio-gyp <project-root> [...options] [...flags]

    Possible options and their meaning:

        --update-root-url https://anio.sh/anio-gyp/
            Root URL to determine which project files need to be updated:

                {ROOT_URL}/v{MAJOR_VERSION}/{FILE_PATH}

            Example using default value:

                https://anio.sh/anio-gyp/v0/.github/workflows/cicd.yaml

                Returns

                {
                    "current": {
                        "version": "current-version",
                        "update": {
                            "strategy": "update-strategy",
                            "data": "update-strategy-data"
                        }
                    },
                    "hashmap": {
                        "<sha256-hash-of-v0.0.1>": "0.0.1",
                        "<sha256-hash-of-v0.0.2>": "0.0.2"
                    }
                }

    Possible flags and their meaning:

        -update
            Enable update of project files before preparation

        -force-update
            Force update of files that have been changed from the original version

        -no-scrub
            Disable scrubbing of auto-generated files

        -no-remove
            Disable removal of obsolete auto-generated files

        -no-autogen
            Disable auto-generation of files

        -no-build
            Disable building of output files

        -tests
            Run unit tests before deployment phase

        -deploy
            Needed to enable deployment phase

```

## Types of projects

### CLI

A command line project will need to have the following root structure:

```
/build/
/anio_project.mjs

/src/cli.mjs <- entry point for CLI application (auto shebang in build)
```

### Library

A library project will need to have the following root structure:

```
/build/
/anio_project.mjs

/src/export/ <- functions that get exposed to the outside world
/src/auto/ <- automatically generated code by anio-gyp
```

Optional directories:
```
/bundle.resources/
```

`/src/export/` contains all library functions that should be exposed in the final build.

Sub-directories _can_ be utilized but are discouraged since their import names get changed:

`/src/export/fs/func.mjs` will be exported as `fs$func`. (the slash gets replaced by a dollar sign)

Dots are discouraged too and get replaced by an underscore (i.e. `fs/func.test.mjs` is `fs$func_test`).

`/src/auto/` contains automatically generated functions by the bundler.

A library must expose a factory function for each exported function.

However, factory functions can (in some cases) be automatically generated.

---

## Example output (library)

```
⚡ Update phase

    Skipping because of -no-update

📝 Preparation phase

    Type of project               Library
    Scan of src/export            Found 18 exports and 2 sub-modules (fs, util)
    Files to auto-generate        10 files will be auto-generated
    Files to build                3 files will be built

    Scan of src/auto              Found 0 out of date files or folders
    Scan of build                 Found 0 out of date files or folders

🔍 Reporting phase

    Information about the bundler:

        Version of bundler        v0.7.0
        Version of utilities      v0.11.0
        Version of runtime        v0.3.0

    The following files will be updated or created:

        src/auto/library.mjs                                      lib:createLibraryFile
        src/auto/dict.mjs                                         lib:createDictionaryFile
        src/auto/importWithContextAsync.mjs                       lib:createImportFile
        src/auto/index.mjs                                        lib:createIndexFile
        src/auto/NOTICE.txt                                       lib:createNoticeFile
        src/auto/VERSION.txt                                      lib:createVersionFile
        src/auto/support_files/createModifierFunction.mjs         lib:copySupportFile [synthetic]
        src/auto/support_files/createNamedAnonymousFunction.mjs   lib:copySupportFile [synthetic]
        src/auto/support_files/wrapFactory.mjs                    lib:copySupportFile [synthetic]
        src/auto/support_files/wrapFunction.mjs                   lib:copySupportFile [synthetic]
        build/library.mjs                                         lib:bundleLibraryFile
        build/submodule/fs.mjs                                    lib:createSubModuleFile
        build/submodule/util.mjs                                  lib:createSubModuleFile

    The following files will be included in the bundle:

        No files will be included.

    The bundle id was calculated to be : 962a040d9b766ba7a163a3f072761afc02ffc369 (from 24 files)

🧹 Housekeeping phase

    No files to remove!

🌳 Tree generation phase

    Create src/auto
    Create src/auto/support_files
    Create build
    Create build/submodule

🧼 Scrubbing phase

    Scrub src/auto/library.mjs
    Scrub src/auto/dict.mjs
    Scrub src/auto/importWithContextAsync.mjs
    Scrub src/auto/index.mjs
    Scrub src/auto/NOTICE.txt
    Scrub src/auto/VERSION.txt
    Scrub src/auto/support_files/createModifierFunction.mjs
    Scrub src/auto/support_files/createNamedAnonymousFunction.mjs
    Scrub src/auto/support_files/wrapFactory.mjs
    Scrub src/auto/support_files/wrapFunction.mjs
    Scrub build/library.mjs
    Scrub build/submodule/fs.mjs
    Scrub build/submodule/util.mjs

⚙️  Generation phase

    Generate src/auto/library.mjs
    Generate src/auto/dict.mjs
    Generate src/auto/importWithContextAsync.mjs
    Generate src/auto/index.mjs
    Generate src/auto/NOTICE.txt
    Generate src/auto/VERSION.txt
    Generate src/auto/support_files/createModifierFunction.mjs
    Generate src/auto/support_files/createNamedAnonymousFunction.mjs
    Generate src/auto/support_files/wrapFactory.mjs
    Generate src/auto/support_files/wrapFunction.mjs

🔨 Building phase

    Build build/library.mjs             79.481 ms
    Build build/submodule/fs.mjs         0.518 ms
    Build build/submodule/util.mjs       0.285 ms

🧪 Testing phase


🚀 Deploying phase

    Skipping because -deploy was not specified

✅ Done in 0.103 seconds with no warnings
```
