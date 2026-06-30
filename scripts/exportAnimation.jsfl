// BTL Asset Pipeline - Adobe Animate Export Script
// Exports semantic animation data (no pixel coordinates)
// Naming convention: LAYER_NAME:POSE_ID
// Example: WINGS:flap_up, HEAD:tilt_left

(function() {
    var doc = fl.getDocumentDOM();
    if (!doc) {
        alert("Please open a FLA document first.");
        return;
    }

// Get animation metadata
var animationId = prompt("Enter animation ID:", doc.name.replace(".fla", ""));
if (!animationId) {
    alert("Animation ID is required.");
    return;
}

var skeletonId = prompt("Enter skeleton ID:", "default_skeleton");
if (!skeletonId) {
    alert("Skeleton ID is required.");
    return;
}

// Initialize animation data
var animationData = {
    id: animationId,
    skeleton: skeletonId,
    frames: []
};

// Get timeline
var timeline = doc.getTimeline();
var totalFrames = timeline.frameCount;

// Process each frame
for (var frame = 0; frame < totalFrames; frame++) {
    var frameData = {
        frame: frame,
        slots: {}
    };
    
    var hasChanges = false;
    
    // Process each layer
    for (var layerIndex = 0; layerIndex < timeline.layers.length; layerIndex++) {
        var layer = timeline.layers[layerIndex];
        
        // Skip guide/hidden layers
        if (layer.layerType === "guide" || layer.visible === false) {
            continue;
        }
        
        // Check if this layer has a keyframe on the current frame
        var frameObj = layer.frames[frame];
        if (!frameObj || frameObj.startFrame !== frame) {
            continue; // Skip if not a keyframe
        }
        
        // Parse layer name for slot and pose
        // Format: SLOT_NAME:POSE_ID
        var layerName = layer.name;
        var colonIndex = layerName.indexOf(":");
        
        if (colonIndex === -1) {
            // No pose specified, use neutral
            frameData.slots[layerName] = { pose: "neutral" };
            hasChanges = true;
        } else {
            var slotId = layerName.substring(0, colonIndex).trim();
            var poseId = layerName.substring(colonIndex + 1).trim();
            
            if (slotId && poseId) {
                frameData.slots[slotId] = { pose: poseId };
                hasChanges = true;
            }
        }
    }
    
    // Only add frame if it has slot data
    if (hasChanges) {
        animationData.frames.push(frameData);
    }
}

// Convert to JSON
var jsonString = JSON.stringify(animationData, null, 2);

// Save to file
var outputURI = fl.browseForFileURL("save", "Save animation data as JSON", "animation.json");
if (outputURI) {
    FLfile.write(outputURI, jsonString);
    alert("Animation exported successfully to:\n" + outputURI);
} else {
    alert("Export cancelled.");
}

// Log summary
fl.trace("=== Animation Export Summary ===");
fl.trace("Animation ID: " + animationId);
fl.trace("Skeleton ID: " + skeletonId);
fl.trace("Total Frames: " + animationData.frames.length);
if (animationData.frames.length > 0) {
    fl.trace("Slots: " + Object.keys(animationData.frames[0].slots).join(", "));
} else {
    fl.trace("Warning: No frames exported - check if layers have keyframes");
}

})();
