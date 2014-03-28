#!/bin/bash
if [ "$#" == "0" ]; then
    echo "Missing argument: pass the directory of the presentation you'd like to display as arg. Optionally, pass a second arg for running a client/master presentation"
    exit 1
fi

presentationSrc="$1"
addClientPresentation=0
if [ "$#" == "2" ]; then
    addClientPresentation=1
fi
revealDir="reveal.js"
presentationTarget="$revealDir/presentation"
clientPresentationTarget="now"
if [[ ! -d $revealDir ]]; then
	echo "directory with reveal js codebase not found: $revealDir" 
fi

if [[ ! -d $presentationSrc ]]; then
	echo "presentation dir $presentationSrc not found" 
fi

if [[ ! -f $presentationSrc/index.html ]]; then
	echo "presentation dir $presentationSrc has no index.html file" 
fi

secretKeysFile="secretKeys";
url=` sed -n 1p $secretKeysFile`
secret=` sed -n 2p $secretKeysFile`
id=`sed -n 3p $secretKeysFile`
if [[ $addClientPresentation == 1 ]]; then
	echo "Adding client (slave) presentation"
	rm -rf $clientPresentationTarget;
	cp -r $presentationSrc $clientPresentationTarget;
	
	
	if [[ -z "$url" || -z "$secret" || -z "$id" ]] ; then
	   echo "could not create client presentation. One of the following values is missing:"
	   echo "url: $url"
	   echo "secret: $secret"
	   echo "id: $id"
	   exit 1;
	fi
	#id="'$id'"
	#url="'$url'"
	#secret="'$secret'"
	
	#enabling dependencies
	`sed -i "s/\/\/\({ src: '\/\/cdnjs\.cloudflare\.com\)/\1/" $clientPresentationTarget/index.html`
	#only enable client inclusion!
	`sed -i "s/\/\/\({ src: '\.\.\/reveal\.js\/plugin\/multiplex\/client\)/\1/" $clientPresentationTarget/index.html`
	# adding values
	eval 'sed -i "s/id: null, \/\/multiplex socket id/id: ${id} ,/" $clientPresentationTarget/index.html'
	eval 'sed -i "s/url: null \/\/multiplex server url/url: ${url} /" $clientPresentationTarget/index.html'
	
	echo "   committing and pushing client presentation";
	`git add  $clientPresentationTarget; git commit -m "added new 'most recent' presentation"; git push;`
fi



echo "copying presentation files"
#cleanup stale files
#echo $presentationTarget;
rm -r $presentationTarget;

#create new dir
mkdir $presentationTarget;
#copy files
`cp -r $presentationSrc/* $presentationTarget`;
#fix references in .html files to reveal.js base dir
`ls $presentationTarget/*.html | xargs sed  -i 's/\.\.\/reveal.js\//\.\.\//g'` ;

if [[ $addClientPresentation == 1 ]]; then

	#enabling dependencies
	`sed -i "s/\/\/\({ src: '\/\/cdnjs\.cloudflare\.com\)/\1/" $presentationTarget/index.html`
	#only enable client inclusion!
	`sed -i "s/\/\/\({ src: '\.\.\/plugin\/multiplex\/master\)/\1/" $presentationTarget/index.html`
	#set properties
	eval 'sed -i "s/secret: null, \/\/multiplex secret key/secret: ${secret} ,/" $presentationTarget/index.html'	
	eval 'sed -i "s/id: null, \/\/multiplex socket id/id: ${id} ,/" $presentationTarget/index.html'
	eval 'sed -i "s/url: null \/\/multiplex server url/url: ${url} /" $presentationTarget/index.html'

fi



echo "starting node server. Access presentation by opening http://localhost:8000/presentation/"
cd $revealDir; grunt serve
