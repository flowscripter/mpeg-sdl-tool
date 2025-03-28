from behave import when, then


@when('the executable is launched')
def step_impl(context):
    context.pexpect_wrapper.start()

@when('the executable is launched with arguments "{args}"')
def step_impl(context, args):
    context.pexpect_wrapper.start(args)

@then('the executable should complete with exit code {code:d}')
def step_impl(context, code):
    context.pexpect_wrapper.expect_eof()
    status = context.pexpect_wrapper.complete()
    assert status == code, 'unexpected exit status: {}'.format(status)


@then('the executable should have output "{message}"')
def step_impl(context, message):
    context.pexpect_wrapper.expect(message)
