# Setup
- npm install
- micro app.js
- caddy

## Static scenario 1
```curl http://localhost:4000/index.html -v```

### expectation
serve public/index.html file

### results
failed: redirect to /

### example
```
> curl http://localhost:4000/index.html -v
*   Trying ::1...
* TCP_NODELAY set
* Connected to localhost (::1) port 4000 (#0)
> GET /index.html HTTP/1.1
> Host: localhost:4000
> User-Agent: curl/7.54.0
> Accept: */*
>
< HTTP/1.1 301 Moved Permanently
< Location: /
< Server: Caddy
< Date: Mon, 07 Aug 2017 15:49:56 GMT
< Content-Length: 36
< Content-Type: text/html; charset=utf-8
<
<a href="/">Moved Permanently</a>.

* Connection #0 to host localhost left intac
```

## Static scenario 2
```curl http://localhost:4000/notindex.html -v```

### expectation
serve public/notindex.html file

### results
failed: redirect to /not

### example
```
> curl http://localhost:4000/notindex.html -v
*   Trying ::1...
* TCP_NODELAY set
* Connected to localhost (::1) port 4000 (#0)
> GET /notindex.html HTTP/1.1
> Host: localhost:4000
> User-Agent: curl/7.54.0
> Accept: */*
>
< HTTP/1.1 301 Moved Permanently
< Location: /not
< Server: Caddy
< Date: Mon, 07 Aug 2017 15:53:57 GMT
< Content-Length: 39
< Content-Type: text/html; charset=utf-8
<
<a href="/not">Moved Permanently</a>.

* Connection #0 to host localhost left intact
```

## Static scenario 3
```curl http://localhost:4000/not.html -v```

### expectation
serve public/not.html

### results
passed: served file

### example
```
> curl http://localhost:4000/not.html -v
*   Trying ::1...
* TCP_NODELAY set
* Connected to localhost (::1) port 4000 (#0)
> GET /not.html HTTP/1.1
> Host: localhost:4000
> User-Agent: curl/7.54.0
> Accept: */*
>
< HTTP/1.1 200 OK
< Accept-Ranges: bytes
< Content-Length: 16
< Content-Type: text/html; charset=utf-8
< Etag: "oubo0fg"
< Last-Modified: Mon, 07 Aug 2017 15:50:39 GMT
< Server: Caddy
< Date: Mon, 07 Aug 2017 15:55:49 GMT
<
Public not.html
* Connection #0 to host localhost left intact
```

## Internal scenario 1
```curl http://localhost:4000/secure/index.html -v```

### expectations
app server returns X-Accel-Redirect of /private/index.html and then caddy serves public/private/index.html

### results
failed: returns redirect to http://localhost:3000/private/

### notes
The redirect contains the direct address to the app server, not the caddy proxy.

If the proxy server is intentionally unreachable, for example on an internal network, this exposes the internal IP and port

### example
```
> curl http://localhost:4000/secure/index.html -v
*   Trying ::1...
* TCP_NODELAY set
* Connected to localhost (::1) port 4000 (#0)
> GET /secure/index.html HTTP/1.1
> Host: localhost:4000
> User-Agent: curl/7.54.0
> Accept: */*
>
< HTTP/1.1 301 Moved Permanently
< Date: Mon, 07 Aug 2017 16:02:55 GMT
< Location: http://localhost:3000/private/
< Server: Caddy
< Content-Length: 65
< Content-Type: text/html; charset=utf-8
<
<a href="http://localhost:3000/private/">Moved Permanently</a>.

* Connection #0 to host localhost left intact
```


## Internal scenario 2
```curl http://localhost:4000/secure/notindex.html -v```

### expectations
app server returns X-Accel-Redirect of /private/notindex.html and then caddy serves public/private/notindex.html

### results
failed: returns redirect to http://localhost:3000/private/not

### notes
The redirect contains the direct address to the app server, not the caddy proxy.

If the proxy server is intentionally unreachable, for example on an internal network, this exposes the internal IP and port

### example
```
> curl http://localhost:4000/secure/notindex.html -v
*   Trying ::1...
* TCP_NODELAY set
* Connected to localhost (::1) port 4000 (#0)
> GET /secure/notindex.html HTTP/1.1
> Host: localhost:4000
> User-Agent: curl/7.54.0
> Accept: */*
>
< HTTP/1.1 301 Moved Permanently
< Date: Mon, 07 Aug 2017 16:05:41 GMT
< Location: http://localhost:3000/private/not
< Server: Caddy
< Content-Length: 68
< Content-Type: text/html; charset=utf-8
<
<a href="http://localhost:3000/private/not">Moved Permanently</a>.

* Connection #0 to host localhost left intact
```

## Internal scenario 3
```curl http://localhost:4000/secure/not.html -v```

### expectation
app server returns X-Accel-Redirect of /private/not.html and then caddy serves public/private/not.html

### results
passed: caddy serves internal resource properly

### example
```
> curl http://localhost:4000/secure/not.html -v
*   Trying ::1...
* TCP_NODELAY set
* Connected to localhost (::1) port 4000 (#0)
> GET /secure/not.html HTTP/1.1
> Host: localhost:4000
> User-Agent: curl/7.54.0
> Accept: */*
>
< HTTP/1.1 200 OK
< Accept-Ranges: bytes
< Content-Length: 17
< Content-Type: text/html; charset=utf-8
< Date: Mon, 07 Aug 2017 16:07:55 GMT
< Etag: "oubo0wh"
< Last-Modified: Mon, 07 Aug 2017 15:50:56 GMT
< Server: Caddy
<
Private not.html
* Connection #0 to host localhost left intact
```


## Temporary Workaround
Define the index to something that will not exist.

eg:
```
index abc.xyz
```

