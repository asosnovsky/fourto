export const version = "1.1.10";
export default `
1.1.10 - added reply notifier for new games
1.1.10 - added reply direct after online games
1.1.10 - cleaned styles
1.1.10 - added update button
1.1.9 - fixed bug where typing secret phrase does not work
1.1.9 - fixed bug where you cannot rename your online alias
1.1.8 - naming is more dynamic now
1.1.7 - added self-info nuke button in legal notice
1.1.7 - visual improvements
1.1.6 - Improved singleplayer AI
1.1.5 - Form validations for online play
1.1.4 - Single player AI is a bit smarter
1.1.4 - Online Multiplayer
1.1.3 - Visual bugfixes (no more side-scrolling error)
1.1.1 - Browser version checker (if your browser version is incompatible an error will show up)
1.1.1 - Added legal notes
`.split('\n').filter( n => n.trim() !== "" )