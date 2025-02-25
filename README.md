# A Long Journey

This is a simple contaption of HTML, JS and CSS to make a beutiful wallpaer using Three.JS

## Setting as your wallpaper

If you have [Lively Wallpaper](https://apps.microsoft.com/detail/9ntm2qc6qws7?hl=en-US&gl=US) installed, skip to [Adding the wallpaper](https://github.com/raedhashmi/A-Long-Journey/blob/main/README.md#adding-the-wallpaper)

## Installation 

Go to [Lively Wallpaper](https://apps.microsoft.com/detail/9ntm2qc6qws7?hl=en-US&gl=US) the download the file. Once installed, it will install Lively Wallpaper on your computer.

## Adding the Wallpaper

After Lively Wallpaper has been installed, open it up and then click the ```+``` icon in the top-right corner of the screen

![Lively_Screenshot](https://github.com/raedhashmi/A-Long-Journey/blob/e788e8cf0e5cf526f992f2a126bf18871f20a9c9/Screenshot%202025-02-24%20215009.png)

Then it will ask you to choose the file. Clone this repo in your favorite place to store projects and once that is done choose ```index.html```

## Modifying some settings

Click the 3 dots ```•••``` on any of the default wallpapers and click 'Open file location'. Once that is done, go back to the previous directory where you see two folders; 'SaveData' and 'wallpapers'. Go into 'SaveData' and then 'wptmp' folder. In there will be a folder with a random name (like 'clxdi4se.vrk' or 'quyn4ftr.rsl'). Go into that folder and you will see some files. Add ```index.html```, ```script.js```, and the 3D model file (```aquarius.glb```). The go into 'LivelyInfo.json' and change the ```"FileName"``` attribute's value (probaly in line 10-13) to your path at the point that you've reached in File Explorer (Should include 'Library\SaveData\wptmp') and add '\\index.html' to it. Now the path you pasted earlier will have some red lines under the \ part of the path so you will need to add antoher \ to the exsisting \

That's it, enjoy tour wallpaper!
