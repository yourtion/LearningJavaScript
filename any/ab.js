let reqCount = 0;

// 模拟请求
async function request(url) {
  reqCount += 1;
  const time = Math.random() * 100;
  return new Promise((reslove) =>
    setTimeout(() => {
      reslove({
        statusCode: 200,
        body: 'hello world',
        url,
        id: url.split('=')[1],
        time,
      });
    }, time)
  );
}

async function ab(url, { concurrency, total }) {
  let conc = concurrency;
  let done = 0;
  let rest = total;

  const result = { max: Number.MIN_SAFE_INTEGER, min: Number.MAX_SAFE_INTEGER, all: 0, success: 0, error: 0 };

  function processResult(cost) {
    if (cost > result.max) {
      result.max = cost;
    }
    if (cost < result.min) {
      result.min = cost;
    }
    result.all += cost;
  }

  async function req(id, u) {
    if (rest < 1) return;
    rest -= 1;
    const start = Date.now();
    try {
      const ret = await request(u + '?id=' + id);
      result.success += 1;
      const cost = Date.now() - start;
      processResult(cost);
      console.log(JSON.stringify(ret));
    } catch (err) {
      result.error += 1;
    }
    done += 1;
    if (id < conc) {
      return req(id, url);
    }
  }

  async function invoke() {
    for (let i = 0; i < conc; i++) {
      req(i, url);
    }
    return new Promise((reslove) => {
      const timer = setInterval(() => {
        if (done >= total) {
          clearInterval(timer);
          result.avg = parseInt(result.all / done, 10);
          reslove(result);
        }
      }, 1000);
    });
  }

  function updateConcurrency(num) {
    //    console.log("=======", num)
    const oldConc = conc;
    conc = num;
    if (oldConc < num) {
      for (let i = oldConc; i < num; i++) {
        req(i, url);
      }
    }
  }
  return { invoke, updateConcurrency };
}

async function main() {
  const { invoke, updateConcurrency } = await ab('http://baidu.com', { concurrency: 100, total: 10000 });

  let i = 1;
  const timer = setInterval(() => {
    updateConcurrency(100 * i);
    if (i < 5) {
      i++;
    } else if (i == 5) {
      i--;
    }
  }, 200);

  const ret = await invoke();

  clearInterval(timer);

  console.log(reqCount);
  return ret;
}

main().then(console.log);
