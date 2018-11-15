# pdf-sync

pdf-sync is add sync to pdf.js

## Contributing

pdf-sync is an open source project and always looking for more contributors. To
get involved, visit:

+ [Projects](https://github.com//sherylynn//pdf-sync)

Feel free to stop by #pdfjs on irc.mozilla.org for questions or guidance.


## Getting the Code

To get a local copy of the current code, clone it using git:

    $ git clone https://github.com/sherylynn/pdf-sync.git
    $ cd pdf-sync

Next, install Node.js via the [official package](https://nodejs.org) or via
[nvm](https://github.com/creationix/nvm). You need to install the gulp package
globally (see also [gulp's getting started](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md#getting-started)):


If everything worked out, install all dependencies for pdf-sync:

    $ npm install

If you want to SYNC your reading process,  install all dependencies for pouchDB server, and just run

    $ npm run db_level

Finally, you need to start a local web server as some browsers do not allow opening
PDF files using a `file://` URL. Run:

    $ npm start

and then you can open:

+ http://localhost:9000/pdf/web/index.html

It is also possible to view all test PDF files on the right side by opening:

+ http://localhost:8888/test/pdfs/?frame

## Running in electron

If you want app version, just like electron, then you can run

    $ npm run app

## Building pdf-sync

In order to bundle all `src/` files into two production scripts and build the generic
viewer, run:

    $ npm run build


## Building electron version pdf-sync

If you want to build your electron app, then you can just run

    $ npm run dist_/*target platform*/

