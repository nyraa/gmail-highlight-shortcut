InboxSDK.load(2, 'sdk_Quickstart_1a1a2c2c4c').then(function(sdk){
    console.log('InboxSDK Loaded');
    console.log(sdk);
    let handle = sdk.Keyboard.createShortcutHandle({chord: "ctrl+alt+h", description: "highlight"});
    sdk.Compose.registerComposeViewHandler((composeView) => {
        let body = composeView.getBodyElement();
        body.addEventListener("keydown", (e) => {
            // ctrl+alt+h
            if (e.ctrlKey && e.altKey && e.keyCode == 72) {
                const selection = document.getSelection().getRangeAt(0);
                if(!selection.collapsed && body.contains(selection.startContainer) && body.contains(selection.endContainer)) {
                    let parent = selection.commonAncestorContainer;
                    if(parent.nodeType == Node.TEXT_NODE) {
                        parent = parent.parentNode;
                    }

                    console.log(parent);

                    function clearContentHighlight(fragment) {
                        let spans = fragment.querySelectorAll("span");
                        for(let i = 0; i < spans.length; i++) {
                            if(spans[i].style.backgroundColor) {
                                let content = new DocumentFragment();
                                for(let j = 0; j < spans[i].childNodes.length; j++) {
                                    content.appendChild(spans[i].childNodes[j].cloneNode(true));
                                }
                                spans[i].parentNode.replaceChild(content, spans[i]);
                            }
                        }
                    }

                    // condition 1: normal text -> extract and highlight
                    if(!parent.style.backgroundColor) {
                        let colorSpan = document.createElement("span");
                        colorSpan.style.backgroundColor = "yellow";
                        let fragment = selection.extractContents();
                        // remove all color in fragment
                        clearContentHighlight(fragment);
                        colorSpan.appendChild(fragment);
                        selection.insertNode(colorSpan);
                    }
                    // condition 2: already highlighted part -> extract and change color
                    else if(parent != body && parent.style.backgroundColor) {
                        if(parent.style.backgroundColor == "yellow") {
                            let colorSpan = document.createElement("span");
                            colorSpan.style.backgroundColor = "red";
                            let fragment = selection.extractContents();
                            // remove all color in fragment
                            clearContentHighlight(fragment);
                            colorSpan.appendChild(fragment);
                            selection.insertNode(colorSpan);
                        }
                        else if(parent.style.backgroundColor == "red") {
                            console.log("clear");
                            // remove all color in fragment
                            let nextParent = parent.parentNode;
                            if(nextParent.nodeType == Node.TEXT_NODE) {
                                nextParent = nextParent.parentNode;
                            }
                            clearContentHighlight(nextParent);
                        }
                    }
                    // condition 3: already highlighted all -> extract and change color
                }
            }
        });
    });
});