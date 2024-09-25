Working version as of 24-Sept-25 
UFO finder working with up to 4 nuclides
The UFO finder presently only calculates assuming same lap number as the reference

The analyte finder works fine.  Using two references at same lap number you can calculate 
the inherent delay t0.  Using two references at different lap numbers you can calculate 
the oscillation time b of reference #1.  

The time of flight of an known analyte can be calculated at any lap number if b ant t0 
are calculated or directly input by the user.  Alternatively, if the analyte's time-of-flight is provided then the atomic mass deviation 
from AME21 can be calculated.

If the lap number is not known for reference #2 or for the analyte, it can be determined 
by supplying the ejection time from the MRTOF if values for b and t0 are provided or have 
been calculated already.
