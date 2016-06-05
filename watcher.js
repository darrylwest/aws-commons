#!/usr/bin/env node

// dpw@alameda.local
// 2015.03.04
'use strict';

const fs = require( 'fs' ),
    dash = require( 'lodash' ),
    spawn = require( 'child_process' ).spawn,
    clearScreen = function() {
        /* jshint -W100 */
        /* jshint -W113 */
        process.stdout.write( '[H[2J' );
        /* jshint +W113 */
        /* jshint +W100 */
    };

let jsfiles = new Set(),
    tid,
    lastRun = Date.now();

const spawnJob = function( runner ) {
    runner.stdout.on( 'data', function( data ) {
        process.stdout.write( data );
    } );

    runner.stderr.on( 'data', function( data ) {
        process.stdout.write( data );
    } );

    runner.on( 'close', function( code ) {
        if ( code !== 0 ) {
            console.log( 'did not exit correctly, code: ', code );
        }

        tid = null;
    } );
};

const run = function() {
    clearScreen();
    console.log( 'files: ', jsfiles );
    spawnJob( spawn( 'make', [ 'jshint' ]));
    spawnJob( spawn( 'make', [ 'test-short' ]));
    // spawnJob( spawn( './node_modules/mocha/bin/mocha', [ 'test/dao/UserDaoTests.js' ] ));

    jsfiles.clear();
};

const changeHandler = function( event, filename ) {

    // this could create dups, but better that than to miss a file...
    if ( dash.endsWith( filename, '.js' ) ) {
        jsfiles.add( filename );
    }

    if ( jsfiles.size > 0 && !tid ) {
        tid = setTimeout( function() {
            run();
        }, 250 );
    }
};

fs.watch( 'lib/', {recursive: true}, changeHandler );
fs.watch( 'test/', {recursive: true}, changeHandler );

console.log( 'watcher started...' );
run();


