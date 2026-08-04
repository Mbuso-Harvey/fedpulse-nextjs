/**
 * Analyzes an array of data objects to determine column types and cardinality.
 * @param {Array<Object>} data 
 * @returns {Object} A map of column names to their profiles.
 */
export function analyzeData(data) {
  if (!data || data.length === 0) return {};

  const profiles = {};
  
  // Initialize profiles based on the first object's keys
  const keys = Object.keys(data[0]);
  keys.forEach(key => {
    profiles[key] = {
      type: 'unknown',
      uniqueValues: new Set(),
      cardinality: 0
    };
  });

  // Sample data (up to 100 rows for performance)
  const sampleSize = Math.min(data.length, 100);
  
  for (let i = 0; i < sampleSize; i++) {
    const row = data[i];
    keys.forEach(key => {
      const val = row[key];
      if (val === null || val === undefined) return;
      
      profiles[key].uniqueValues.add(val);

      // Simple type inference
      if (profiles[key].type === 'unknown') {
        if (typeof val === 'number') {
          profiles[key].type = 'number';
        } else if (typeof val === 'string') {
          // Check if it's a valid date string (simple heuristic: Date.parse works and it's not a raw number string)
          if (!isNaN(Date.parse(val)) && isNaN(val)) {
            profiles[key].type = 'date';
          } else if (!isNaN(parseFloat(val)) && isFinite(val)) {
            // It's a string that looks exactly like a number
            profiles[key].type = 'number';
          } else {
            profiles[key].type = 'string';
          }
        }
      }
    });
  }

  // Finalize profiles (calculate cardinality and clean up Sets to save memory)
  keys.forEach(key => {
    profiles[key].cardinality = profiles[key].uniqueValues.size;
    profiles[key].cardinalityRatio = profiles[key].uniqueValues.size / sampleSize;
    delete profiles[key].uniqueValues;
  });

  return profiles;
}
