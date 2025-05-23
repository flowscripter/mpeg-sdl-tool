import os

from support.pexpect_wrapper import PExpectWrapper


def before_scenario(context, scenario):

    context.config.setup_logging()
    context.pexpect_wrapper = PExpectWrapper(os.environ.get('EXECUTABLE'))
