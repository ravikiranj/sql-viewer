### Imagemagick commands
```
convert sql-viewer-1.png -resize '1280x800^' -gravity NorthWest -crop '1280x800+0+0' +repage sql-viewer-1-1280x800.png
convert sql-viewer-1.png -resize '440x280^' -gravity Center -crop '440x280+0+0' +repage sql-viewer-1-440x280.png

convert sql-viewer-2.png -resize '1280x800^' -gravity NorthWest -crop '1280x800+0+0' +repage sql-viewer-2-1280x800.png
convert sql-viewer-2.png -resize '440x280^' -gravity Center -crop '440x280+0+0' +repage sql-viewer-2-440x280.png
```
