Working version as of 5-June-2026 
UFO finder working with up to 8 nuclides and 20 total atoms
The UFO finder can calculate across large range of lap numbers differnt from the reference if circulation time is available.
UFO finder is now very fast, provides a progress bar, and can be interrupted.

The analyte finder works fine.  Using two references at same lap number you can calculate 
the inherent delay t0.  Using two references at different lap numbers you can calculate 
the circulation time ("b-value") of reference #1.  

The time of flight of an known analyte can be calculated at any lap number if b and t0 
are calculated or directly input by the user.  A bug still exists in calculating the atomic mass deviation 
from AME21 from a provided analyte time-of-flight.

If the lap number is not known for reference #2 or for the analyte, it can be determined 
by supplying the ejection time from the MRTOF if values for b and t0 are provided or have 
been calculated already.
