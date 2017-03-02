# TypeSite
This simple web page simulate a person typing on a linux terminal.

In the index.html there are two structural div tags.
In `#player_data` you must put the data you want to "type" and in the `#player_area` it will be rendered as a simulation of a man typing on keyboard.
All the tags in `#player_data` must be a `<div>` tags

| Attribute	| Value			| Description														|
|-----------|:-------------:|-------------------------------------------------------------------|
| wait		| Integer		| Msec to wait from the end of previous task						|
| delay 	| Integer		| Msec of delay between a "type" and another						|
| rollback 	| Integer		| Number of char to delete											|
| inline 	| Boolean Text	| Continue ( or not ) typing in the same line of the previous task	|
| clear 	| Boolean Text	| Delete all the text												|

As example:
```html
<div wait="0">alessio@TypeSite:~$ </div>
<div wait="2000" delay="25" inline="true">clear</div>
<div wait="1000" clear="true"></div>
```
The previous code will simulate a "clear" terminal command.

You can see a fully working example on my own site @ [www.alessiocarrafa.it](http://www.alessiocarrafa.it)