## Executable Functional Tests

#### Setup

Ensure the executable is built:

    bun build ../index.ts --compile --outfile /tmp/mpeg-sdl-tool

Install requirements:

    pip3 install -r pip-requirements.txt

#### Testing

Run the functional tests:

    export EXECUTABLE=/tmp/mpeg-sdl-tool
    behave

To run with logging output from the test steps (this is the best set of
arguments I can find):

    behave --no-logcapture --no-color --logging-level=DEBUG
