# what are http headers
# metadata -> key-value send along with request and response
# caching, authentication, manage state
   # x-perfix -> 2012 (x-deprecated)
## type of headers
# Request Headers  -> from client
# Response Headers -> from server 
# Repressentation Headers -> encoding / compression
# payload Headers -> data

## Most Common Headers
# Accept : application/json
# User-Agent
# Authorization
# Content -Type
# Cookie
# Cache - Control

## CORS
# Access-Control-Allow-Origin
# Access-Control-Allow-Credebttials
# Access-Contorol-Allow-Method

## Security
# Cross-origin-Embedded-Policy
# Cross-origin-Opener-Policy
# Content-Security-Policy
# X-XCS-Protection


## HTTP Methods
# Basuc set of operations that can be used to interact with server

# GET : retrive a resource
# HEAD : No message boy (respnse headers only)
# OPTIONS : with operations are available
# TRACE : loopback test (get same data)
# DELETE : remove a resource
# PUT : replace a resources
# POST : Interact with resources (mostly added)
# PATCH : change past of a resources


## HTTP STATUS CODE
 # 1xx   -> Informational
 # 2xx   -> Success
 # 3xx   -> Redirect 
 # 4xx   -> Client error
 # 5xx   -> Server Error

 # 100 - continue                
 # 102 - processing
 # 200 - ok
 # 201 - created 
 # 202 - accepted
 # 307 - temporary redirect
 # 308 - perment 
 # 400 - Bad Request
 # 401 - Unauthorized
 # 402 - Payment required
 # 500 - Internal Server Error
 # 504 - Gate way time dut
