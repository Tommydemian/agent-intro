# PATTERNS: 

## ONE-OFF PATTERN: 
- Transactional - *no memory* | *Stateless*. 
- i.e: here's x topic - make a description of it.

## CHAT-PATTERN:


 ### Tools 
 function call can fall into 3 categories depending on matchn accuracy between user and LLM tools: 

 1. clear Match:
 *USER*: hey, what's the capital of Argentina? 
 *LLM*: calls [get_country_capital] with {"location": "Argentina"}

 2. Ambiguous: 
 *USER*: hey, how's the capital of Argentina doing today?
 *LLM*: could call [get_country_capital] | might give gral info

3. No match: 
 *USER*: Tell me about Typscript
 *LLM*: regular response | no function call 

### OPERATION ORDER:
You must add → then fetch → then send.

