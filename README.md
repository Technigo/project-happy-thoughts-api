# Project Happy Thoughts API

Breif: Build an backend to the twitter-like app "happy thoughts" where the user can post, see and like messages.

## Tech

MongoDB, Mongoose, Express, JS

## View it live

Frontend: https://paulines-happy-thoughts.netlify.app/

Backend: https://happy-thoughts-pauline.herokuapp.com/

<br>
<br>
<br>

# API Documentation

## Live 

https://app.swaggerhub.com/apis-docs/Pauan86/HappyThoughts/1.0.0

## Html

  <body>
  <h1>Happy Thoughts</h1>
    <div class="app-desc">This is a simple API for a the twitter-like app &quot;Happy Thoughts&quot;</div>
    <div class="app-desc">More information: <a href="https://helloreverb.com">https://helloreverb.com</a></div>
    <div class="app-desc">Contact Info: <a href="pauline.j.andersson@gmail.com">pauline.j.andersson@gmail.com</a></div>
    <div class="app-desc">Version: 1.0.0</div>
    <div class="app-desc">BasePath:/apis-docs/Pauan86/HappyThoughts/1.0.0</div>
    <div class="license-info">Apache 2.0</div>
    <div class="license-url">http://www.apache.org/licenses/LICENSE-2.0.html</div>
  <h2>Access</h2>

  <h2><a name="__Methods">Methods</a></h2>
  [ Jump to <a href="#__Models">Models</a> ]

  <h3>Table of Contents </h3>
  <div class="method-summary"></div>
  <h4><a href="#Endpoints">Endpoints</a></h4>
  <ul>
  <li><a href="#rootGet"><code><span class="http-method">get</span> /</code></a></li>
  </ul>
  <h4><a href="#Like">Like</a></h4>
  <ul>
  <li><a href="#thoughtsThoughtsIdLikePost"><code><span class="http-method">post</span> /thoughts/{thoughtsId}/like</code></a></li>
  </ul>
  <h4><a href="#Remove">Remove</a></h4>
  <ul>
  <li><a href="#thoughtsDelete"><code><span class="http-method">delete</span> /thoughts</code></a></li>
  <li><a href="#thoughtsThoughtsIdDeleteDelete"><code><span class="http-method">delete</span> /thoughts/{thoughtsId}/delete</code></a></li>
  </ul>
  <h4><a href="#Thought">Thought</a></h4>
  <ul>
  <li><a href="#thoughtsGet"><code><span class="http-method">get</span> /thoughts</code></a></li>
  <li><a href="#thoughtsPost"><code><span class="http-method">post</span> /thoughts</code></a></li>
  </ul>

  <h1><a name="Endpoints">Endpoints</a></h1>
  <div class="method"><a name="rootGet"></a>
    <div class="method-path">
    <a class="up" href="#__Methods">Up</a>
    <pre class="get"><code class="huge"><span class="http-method">get</span> /</code></pre></div>
    <div class="method-summary">Displays all endpoints for this API as links (<span class="nickname">rootGet</span>)</div>
    <div class="method-notes"></div>
  <h3 class="field-label">Return type</h3>
    <div class="return-type">
      array[<a href="#inline_response_200">inline_response_200</a>]
  </div>
    <!--Todo: process Response Object and its headers, schema, examples -->
    <h3 class="field-label">Example data</h3>
    <div class="example-data-content-type">Content-Type: application/json</div>
    <pre class="example"><code>[ {
  "path" : "path",
  "methods" : [ "methods", "methods" ],
  "middleware" : [ "middleware", "middleware" ]
}, {
  "path" : "path",
  "methods" : [ "methods", "methods" ],
  "middleware" : [ "middleware", "middleware" ]
} ]</code></pre>
    <h3 class="field-label">Produces</h3>
    This API call produces the following media types according to the <span class="header">Accept</span> request header;
    the media type will be conveyed by the <span class="header">Content-Type</span> response header.
    <ul>
      <li><code>application/json</code></li>
    </ul>
    <h3 class="field-label">Responses</h3>
    <h4 class="field-label">200</h4>
    Succesful connection
    <h4 class="field-label">404</h4>
    No connection to server
        <a href="#"></a>
  </div> <!-- method -->
  <hr/>
  <h1><a name="Like">Like</a></h1>
  <div class="method"><a name="thoughtsThoughtsIdLikePost"></a>
    <div class="method-path">
    <a class="up" href="#__Methods">Up</a>
    <pre class="post"><code class="huge"><span class="http-method">post</span> /thoughts/{thoughtsId}/like</code></pre></div>
    <div class="method-summary"> (<span class="nickname">thoughtsThoughtsIdLikePost</span>)</div>
    <div class="method-notes">Automatic increase of the heart field in the specified message id</div>
    <h3 class="field-label">Path parameters</h3>
    <div class="field-items">
      <div class="param">thoughtsId (required)</div>
          <div class="param-desc"><span class="param-type">Path Parameter</span> &mdash; The message id </div>    </div>  <!-- field-items -->
  <!--Todo: process Response Object and its headers, schema, examples -->
 <h3 class="field-label">Responses</h3>
    <h4 class="field-label">200</h4>
    Hearts updated succesfully
        <a href="#"></a>
    <h4 class="field-label">400</h4>
    Invalid message id
        <a href="#"></a>
    <h4 class="field-label">503</h4>
    No connection to server
        <a href="#"></a>
  </div> <!-- method -->
  <hr/>
  <h1><a name="Remove">Remove</a></h1>
  <div class="method"><a name="thoughtsDelete"></a>
    <div class="method-path">
    <a class="up" href="#__Methods">Up</a>
    <pre class="delete"><code class="huge"><span class="http-method">delete</span> /thoughts</code></pre></div>
    <div class="method-summary">Delete all messages in the feed (<span class="nickname">thoughtsDelete</span>)</div>
    <div class="method-notes"></div>

  <!--Todo: process Response Object and its headers, schema, examples -->
 <h3 class="field-label">Responses</h3>
    <h4 class="field-label">200</h4>
    Succesfully deletion of all messages
        <a href="#"></a>
    <h4 class="field-label">400</h4>
    Something went wrong
        <a href="#"></a>
    <h4 class="field-label">503</h4>
    No connection to server
        <a href="#"></a>
  </div> <!-- method -->
  <hr/>
  <div class="method"><a name="thoughtsThoughtsIdDeleteDelete"></a>
    <div class="method-path">
    <a class="up" href="#__Methods">Up</a>
    <pre class="delete"><code class="huge"><span class="http-method">delete</span> /thoughts/{thoughtsId}/delete</code></pre></div>
    <div class="method-summary"> (<span class="nickname">thoughtsThoughtsIdDeleteDelete</span>)</div>
    <div class="method-notes">Delete one specific message</div>
    <h3 class="field-label">Path parameters</h3>
    <div class="field-items">
      <div class="param">thoughtsId (required)</div>
          <div class="param-desc"><span class="param-type">Path Parameter</span> &mdash; The message id </div>    </div>  <!-- field-items -->
  <!--Todo: process Response Object and its headers, schema, examples -->
 <h3 class="field-label">Responses</h3>
    <h4 class="field-label">200</h4>
    Message deleted succesfully
        <a href="#"></a>
    <h4 class="field-label">400</h4>
    Invalid message id
        <a href="#"></a>
    <h4 class="field-label">503</h4>
    No connection to server
        <a href="#"></a>
  </div> <!-- method -->
  <hr/>
  <h1><a name="Thought">Thought</a></h1>
  <div class="method"><a name="thoughtsGet"></a>
    <div class="method-path">
    <a class="up" href="#__Methods">Up</a>
    <pre class="get"><code class="huge"><span class="http-method">get</span> /thoughts</code></pre></div>
    <div class="method-summary">Show last 20 posted messages in the feed (<span class="nickname">thoughtsGet</span>)</div>
    <div class="method-notes"></div>
  <h3 class="field-label">Return type</h3>
    <div class="return-type">
      <a href="#inline_response_200_1">inline_response_200_1</a>
  </div>
    <!--Todo: process Response Object and its headers, schema, examples -->
    <h3 class="field-label">Example data</h3>
    <div class="example-data-content-type">Content-Type: application/json</div>
    <pre class="example"><code>""</code></pre>
    <h3 class="field-label">Produces</h3>
    This API call produces the following media types according to the <span class="header">Accept</span> request header;
    the media type will be conveyed by the <span class="header">Content-Type</span> response header.
    <ul>
      <li><code>application/json</code></li>
    </ul>
    <h3 class="field-label">Responses</h3>
    <h4 class="field-label">200</h4>
    Succesfull connection
        <a href="#inline_response_200_1">inline_response_200_1</a>
    <h4 class="field-label">400</h4>
    Something went wrong
        <a href="#"></a>
    <h4 class="field-label">503</h4>
    No connection to server
        <a href="#"></a>
  </div> <!-- method -->
  <hr/>
  <div class="method"><a name="thoughtsPost"></a>
    <div class="method-path">
    <a class="up" href="#__Methods">Up</a>
    <pre class="post"><code class="huge"><span class="http-method">post</span> /thoughts</code></pre></div>
    <div class="method-summary">Add a new message to the feed (<span class="nickname">thoughtsPost</span>)</div>
    <div class="method-notes"></div> <h3 class="field-label">Consumes</h3>
    This API call consumes the following media types via the <span class="header">Content-Type</span> request header:
    <ul>
      <li><code>application/json</code></li>
    </ul>
    <h3 class="field-label">Request body</h3>
    <div class="field-items">
      <div class="param">body <a href="#Message">Message</a> (required)</div>
          <div class="param-desc"><span class="param-type">Body Parameter</span> &mdash; A JSON object containing message information </div>
                </div>  <!-- field-items -->


 <!--Todo: process Response Object and its headers, schema, examples -->
 <h3 class="field-label">Responses</h3>
    <h4 class="field-label">400</h4>
    Something went wrong
        <a href="#"></a>
    <h4 class="field-label">503</h4>
    No connection to server
        <a href="#"></a>
  </div> <!-- method -->
  <hr/>

  <h2><a name="__Models">Models</a></h2>
  [ Jump to <a href="#__Methods">Methods</a> ]

  <h3>Table of Contents</h3>
  <ol>
    <li><a href="#Message"><code>Message</code></a></li>
    <li><a href="#Messages"><code>Messages</code></a></li>
    <li><a href="#NoMessage"><code>NoMessage</code></a></li>
    <li><a href="#inline_response_200"><code>inline_response_200</code></a></li>
    <li><a href="#inline_response_200_1"><code>inline_response_200_1</code></a></li>
  </ol>

  <div class="model">
    <h3><a name="Message"><code>Message</code></a> <a class="up" href="#__Models">Up</a></h3>
    <div class="field-items">
      <div class="param">_id (optional)</div><div class="param-desc"><span class="param-type"><a href="#string">String</a></span>  </div>
          <div class="param-desc"><span class="param-type">example: 609c62ddb14fe7283c71e315</span></div>
<div class="param">message (optional)</div><div class="param-desc"><span class="param-type"><a href="#string">String</a></span>  </div>
          <div class="param-desc"><span class="param-type">example: Hey how&#x27;s it going!?</span></div>
<div class="param">createdAt (optional)</div><div class="param-desc"><span class="param-type"><a href="#date">date</a></span>  format: date</div>
<div class="param">hearts (optional)</div><div class="param-desc"><span class="param-type"><a href="#BigDecimal">BigDecimal</a></span>  </div>
          <div class="param-desc"><span class="param-type">example: 2</span></div>
    </div>  <!-- field-items -->
  </div>
  <div class="model">
    <h3><a name="Messages"><code>Messages</code></a> <a class="up" href="#__Models">Up</a></h3>
    <div class="field-items">
          </div>  <!-- field-items -->
  </div>
  <div class="model">
    <h3><a name="NoMessage"><code>NoMessage</code></a> <a class="up" href="#__Models">Up</a></h3>
    <div class="field-items">
      <div class="param">message (optional)</div><div class="param-desc"><span class="param-type"><a href="#string">String</a></span>  </div>
          <div class="param-desc"><span class="param-type">example: There are no thougths</span></div>
    </div>  <!-- field-items -->
  </div>
  <div class="model">
    <h3><a name="inline_response_200"><code>inline_response_200</code></a> <a class="up" href="#__Models">Up</a></h3> 
    <div class="field-items">
      <div class="param">path (optional)</div><div class="param-desc"><span class="param-type"><a href="#string">String</a></span>  </div>
<div class="param">methods (optional)</div><div class="param-desc"><span class="param-type"><a href="#string">array[String]</a></span>  </div>
<div class="param">middleware (optional)</div><div class="param-desc"><span class="param-type"><a href="#string">array[String]</a></span>  </div>
    </div>  <!-- field-items -->
  </div>
  <div class="model">
    <h3><a name="inline_response_200_1"><code>inline_response_200_1</code></a> <a class="up" href="#__Models">Up</a></h3> 
    <div class="field-items">
          </div>  <!-- field-items -->
  </div>
  </body>
</html>
