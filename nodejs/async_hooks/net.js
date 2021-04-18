const async_hooks = require('async_hooks');
const fs = require('fs');

let indent = 0;
async_hooks
  .createHook({
    init(asyncId, type, triggerAsyncId) {
      const eid = async_hooks.executionAsyncId();
      const indentStr = ' '.repeat(indent);
      fs.writeSync(
        process.stdout.fd,
        `${indentStr}${type}(${asyncId}):` + ` trigger: ${triggerAsyncId} execution: ${eid}\n`
      );
    },
    before(asyncId) {
      const indentStr = ' '.repeat(indent);
      fs.writeSync(process.stdout.fd, `${indentStr}before:  ${asyncId}\n`);
      indent += 2;
    },
    after(asyncId) {
      indent -= 2;
      const indentStr = ' '.repeat(indent);
      fs.writeSync(process.stdout.fd, `${indentStr}after:  ${asyncId}\n`);
    },
    destroy(asyncId) {
      const indentStr = ' '.repeat(indent);
      fs.writeSync(process.stdout.fd, `${indentStr}destroy:  ${asyncId}\n`);
    },
  })
  .enable();

require('net')
  .createServer(() => {})
  .listen(8080, () => {
    // Let's wait 10ms before logging the server started.
    setTimeout(() => {
      console.log('>>>', async_hooks.executionAsyncId());
    }, 10);
  });
