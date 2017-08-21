gulp-download-2
===============

_Heavily_ derived from [gulp-download-stream](https://github.com/michalc/gulp-download-stream) and [gulp-download](https://github.com/Metrime/gulp-download)

A tiny [hyperquest](https://github.com/substack/hyperquest) gulp wrapper to download files over HTTP/HTTPS/FTP/FTPS + following redirects.

### Features
* ASCII progress bar
* Concurrent downloads without busy-waiting
* Redirect support (up to 10 hops)
* `ftp(s)://` support
* Minimal buffering

Here's a nice example:

```
Downloading http://ipv4.download.thinkbroadband.com/512MB.zip...
  downloading [====================] 205491/bps 100% 0.0s
Done

  downloading [====================] 358297/bps 100% 0.0s
Done

  downloading [====================] 2664869/bps 100% 0.0s
Done

  downloading [=======-------------] 2126399/bps 33% 65.9s
Done

```

### Why?
I was having an issue where I was pulling external files as part of a gulp task. I used `gulp-download`, but due to the plugin's inactivity and stream buffering, my machine was running out of memory/switching to swap. I decided to take the good parts of `gulp-download` and `gulp-download-stream` to create something current.

`gulp-download2` works by writing directly to disk, leveraging node's natural non-blocking I/O for better performance when downloading large files on a system with few resources. `gulp-download2` also uses `hyperquest` to speed up parallel downloads, prevent connection pools from hanging, etc.

#### `gulp-download` vs. `gulp-download2`
In `gulp-download2` we saw an average increase of CPU utilization by 31% whereas `gulp-download` writes the file content to a buffer and writes to the disk. This process is not as labor intensive as system calls:

| `gulp-download2` | `gulp-download` |
|       :---:      |       :---:     |
| [![cpu utilization](https://preview.ibb.co/jmWC9k/dl2_cpu.png)](https://plot.ly/~djtthompson/20/) | [![dl_cpu](https://preview.ibb.co/fWqTh5/dl_cpu.png)](https://plot.ly/~djtthompson/22/) |

Looking at the memory consumption in `gulp-download2` shows a max memory consumption of 262 MB whereas `gulp-download` buffers the content into memory leading to a steady increase:

| `gulp-download2` | `gulp-download` |
|       :---:      |       :---:     |
| [![dl2_mem](https://preview.ibb.co/eexVvQ/dl2_mem.png)](https://plot.ly/~djtthompson/21/) | [![dl_mem](https://preview.ibb.co/hib125/dl_mem.png)](https://plot.ly/~djtthompson/23/)|

Note: Profiling done with [Syrupy.py](https://github.com/jeetsukumaran/Syrupy) and `v8-profile`.

### Installation

```bash
npm install gulp-download2 --save-dev # or to use yarn...
yarn add gulp-download2 --dev
```

### Basic Usage

```js
const gulp = require('gulp');
const download = require('gulp-download2');

gulp.task('download', () => download('http://example.com/file.jpg').pipe(gulp.dest('build')));
```

### Download Multiple Files

To download multiple files, pass an array of strings to `download`.

```js
gulp.task('download', function () {
	return download([
		'http://example.com/file.a',
		'https://example.com/file.b'
	])
	.pipe(gulp.dest('build'));
});
```

The files are downloaded concurrently into stream of Vinyl files, and so are suitable to be piped into other gulp plugins. Each Vinyl file is also itself a stream, and so any downstream plugins must also support stream-based Vinyl files.

### Specify Local File Name

You can specify the local file names of files downloaded. You can do this for one file:

```js
gulp.task('download', function () {
	return download({
	    url: 'http://example.com/file.txt',
	    name: 'foo.txt'
	})
	.pipe(gulp.dest('build'));
});
```

or for multiple files:

```js
gulp.task('download', function () {
	const files = [
		{
            url: 'http://example.com/file.txt',
            name: 'foo.txt'
        },
        {
        	url: 'http://example.com/file2.csv',
        	name: 'data.csv'
        }
	];

	return download(files)
	.pipe(gulp.dest('build'));
});
```

### Handling Errors
There are two different kinds of errors that can arise when we attempt to download from a remote resource:

1. Hyperquest encounters an error with the stream
    * Sends event object as a callback parameter
2. Hyperquest returns an error status code (i.e. 404)
    * `res.statusCode` is passed as a callback parameter

In either case, we can handle these by providing an error callback in our gulp task:

```js
gulp.task('download', function () {
    return download('http://foo.com/sample.txt', {
        errorCallback: function (code) {
            if (code === 404) {
                console.error('Un oh, something bad happened!');
                doSomethingElse();
            } else if (code === 500) {
                console.error('Fatal exception :(');
                process.exit(1);
            }
        }
    })
});
```

### Pass Options to Hyperquest
You can pass options to request as the second argument. For example, you can request using HTTP authentication:

```js
gulp.task('download', function () {
	const config = {
		auth: {
			user: 'john_doe',
			pass: '123_secret'
		}
	};

	return download({
	    url: 'http://example.com/file.txt',
	    name: 'foo.txt'
	}, config)
	.pipe(gulp.dest('build'));
});
```

See [hyperquest options](https://github.com/substack/hyperquest) for more details.

### Error Handling
For any file, if node can't connect to the server, or the server returns a status code >= 400, then the Vinyl stream will emit an error and the containing gulp task will fail.

```bash
Message:
    connect ECONNREFUSED 127.0.0.1:80
Details:
    code: ECONNREFUSED
    errno: ECONNREFUSED
    syscall: connect
    address: 127.0.0.1
    port: 80
```
