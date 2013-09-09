Installation
============

We use `Grunt` for the development and deployment process. Make sure you have Node.js and Git installed (plus Ruby and Compass too) then install the recommended tools by running:

```
npm install -g yo grunt-cli bower
```

Which will install `yeoman`, `grunt` and `bower`


Use
===

To start the server type the next command in your shell:

```
grunt server
```

And access normally in your browser to the next address:

* http://localhost.lan:9000


Deploy
======

The workflow to create and deploy the static assets is as follow:

```
grunt build
```

* There are some lines in the code which must be commented/uncommented prior to the build, for minification purposes

```
app/scripts/probs_density_layer.js
app/scripts/process_tile_worker.js
```

We don't need to commit the resulting `dist` directory, which will be deployed to the next URL via `S3` command, then we will have to `gzip` and upload the files in the scripts folder:
It is recommended to compress the images with `imageOptim`, too.
```
gzip -9 dist/scripts/living-cities.min.js
mv living-cities.min.js.gz living-cities.min.js
s3cmd sync -P --exclude '.git/' ./ s3://com.vizzuality.livingcities/
s3cmd put -v -P --mime-type='application/javascript' --add-header='Content-Type':'application/javascript' --add-header='Content-Encoding':'gzip' --add-header='Cache-Control':'public, max-age=3600' dist/scripts/living-cities.min.js s3://com.vizzuality.livingcities/scripts/living-cities.min.js
```

* http://livingcities.cartocdn.com/

For more information:

* http://yeoman.io/
* https://github.com/s3tools/s3cmd
* http://imageoptim.com/
