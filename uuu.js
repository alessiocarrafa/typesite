// ===========================================================
//
// this array specifies which processes to run in which order
// add, remove, and reorder items to affect output
   var toRun = ['borders','corners','borders','message','corners'],
//
// ===========================================================

    
// element reference
el = $('.test'), 

// just to make output easier...
output = function(t) { el.append(t+'<br />'); },

// Object containing all of our functions.
// Functions are passed a deferred object to resolve when they complete,
// or when they are ready to intitiate processing of next event.
// For example, resolving as the first step would allow a process to
// run asyncronously with other functions.       
myFunctions = {

    borders: function(dfd) {
       var w = Math.floor(Math.random()*75);
       output('[BORDERS START]');
       el.animate({borderWidth:w}, 1000, function(){
           output('[BORDERS END]');
           dfd.resolve();
       });
    },

    corners: function (dfd) {
        var w = Math.floor(Math.random()*30);
        output('[CORNERS START]');
        el.animate({borderRadius:w}, 1000, function(){
            output('[CORNERS END]');
            dfd.resolve();
        });
    },

    message: function (dfd) {
        output('[MESSAGE] No animations or AJAX');
        output('to be found in this function, but we can');
        output('still use it as a deferred object!');
        dfd.resolve();        
    }
},

// create the main deferred object for the entire loop
deferred = $.Deferred(function(DFD){
    
    // are there 2 or more functions to run?
    if (toRun.length>1) {
        
        // manually create deferred object for the first function
        var defs = [$.Deferred()];
         
        // manually loop through 2nd through next-to-last functions...
        for (n=1; n<toRun.length-1; n++){

            // must create loop closure to preserve proper n var value
            (function(n){
                
                // create a deferred object for this function (n)
                defs.push($.Deferred());
                
                // pipe function n to the previous (n-1) deferred object
                defs[n-1].pipe(function(){
                    
                    // call function n and pass deferred object n to it
                    myFunctions[toRun[n]].call(this,defs[n]);

                });
            })(n);            
        };
        
        // manually pipe the last function to the next-to-last deferred
        // object, and pass the main deferred object for completion
        defs[(toRun.length-2)].pipe(function(){
            myFunctions[toRun[toRun.length-1]].call(this,DFD);
        });
        
        // now that the pipe chain is all set up, begin processing
        // the first function passing in first deferred object
        myFunctions[toRun[0]].call(this,defs[0]);
    

    // is there is only one function to run, the run it and 
    // resolve the main deferred on completion
    } else if (toRun.length>0) {
        myFunctions[toRun[0]].call(this,DFD);
        
    // if there are no functions to run, resolve the main deferred object immediately
    } else {            
        DFD.resolve();
    };  
});

// this will run after the main deferred has completed
deferred.pipe(function(){
   
    /* ... do stuff ... */
    
    output('[COMPLETE] I totally just ran all of those functions (and this one) in order!');
    
});