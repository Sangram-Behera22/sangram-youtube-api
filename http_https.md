# HTTP Headers Overview

HTTP headers are key-value pairs sent along with HTTP requests and responses. They serve as metadata that provides essential information about the request or response, including caching, authentication, and state management.

## Types of HTTP Headers

1. **Request Headers**: Sent from the client to the server.
2. **Response Headers**: Sent from the server back to the client.
3. **Representation Headers**: Indicate the encoding or compression of the payload.
4. **Payload Headers**: Provide information about the data being sent.

## Most Common HTTP Headers

- **Accept**: Specifies the media types that are acceptable for the response (e.g., `application/json`).
- **User-Agent**: Contains information about the client (browser) making the request.
- **Authorization**: Used for authentication purposes.
- **Content-Type**: Indicates the media type of the resource being sent (e.g., `application/json`).
- **Cookie**: Contains stored cookies associated with the domain.
- **Cache-Control**: Directives for caching mechanisms.

## CORS (Cross-Origin Resource Sharing)

CORS headers are used to manage how resources are shared between different origins:

- **Access-Control-Allow-Origin**: Specifies which origins are allowed to access the resource.
- **Access-Control-Allow-Credentials**: Indicates whether the browser should include credentials (like cookies) in the requests.
- **Access-Control-Allow-Methods**: Lists the HTTP methods that are allowed when accessing the resource.

## Security Headers

Security headers help protect against common vulnerabilities:

- **Cross-Origin-Embedder-Policy**: Controls whether a document can embed cross-origin resources.
- **Cross-Origin-Opener-Policy**: Affects how documents from different origins interact.
- **Content-Security-Policy**: Helps prevent XSS attacks by controlling sources of content that can be loaded.
- **X-XSS-Protection**: Provides protection against reflected XSS attacks.

## HTTP Methods

HTTP defines a basic set of operations for interacting with resources:

- **GET**: Retrieve a resource.
- **HEAD**: Similar to GET, but no message body (only response headers).
- **OPTIONS**: Describe the communication options for the target resource.
- **TRACE**: Perform a loopback test (returns the same data).
- **DELETE**: Remove a resource.
- **PUT**: Replace an existing resource or create a new resource at a specified URL.
- **POST**: Submit data to be processed (often used to create new resources).
- **PATCH**: Apply partial modifications to a resource.

## HTTP Status Codes

HTTP responses include status codes that indicate the result of the request:

### 1xx - Informational
- **100**: Continue
- **102**: Processing

### 2xx - Success
- **200**: OK
- **201**: Created
- **202**: Accepted

### 3xx - Redirect
- **307**: Temporary Redirect
- **308**: Permanent Redirect

### 4xx - Client Error
- **400**: Bad Request
- **401**: Unauthorized
- **402**: Payment Required

### 5xx - Server Error
- **500**: Internal Server Error
- **504**: Gateway Timeout

This overview provides a fundamental understanding of HTTP headers, methods, and status codes, essential for web development and API interaction.
