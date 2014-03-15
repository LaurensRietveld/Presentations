#!/bin/bash

if [ "$#" == "0" ]; then
    echo "Missing argument: pass the directory of the presentation you'd like to display as arg"
    exit 1
fi

presentationSrc="$1"
revealDir="reveal.js"
presentationTarget="$revealDir/presentation"
if [[ ! -d $revealDir ]]; then
	echo "directory with reveal js codebase not found: $revealDir" 
fi



if [[ ! -d $presentationSrc ]]; then
	echo "presentation dir $presentationSrc not found" 
fi

if [[ ! -f $presentationSrc/index.html ]]; then
	echo "presentation dir $presentationSrc has no index.html file" 
fi

echo "copying presentation files"
#cleanup stale files
echo $presentationTarget;
rm -r $presentationTarget;

#create new dir
mkdir $presentationTarget;
#copy files
`cp -r $presentationSrc/* $presentationTarget`;
#fix references in .html files to reveal.js base dir
`ls $presentationTarget/*.html | xargs sed  -i 's/\.\.\/reveal.js\//\.\.\//g'` ;

echo "starting node server. Access presentation by opening http://localhost:8000/presentation/"
cd $revealDir; grunt serve
