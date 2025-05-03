import React from 'react';
import LocationsGuide from './LocationsGuide';

// Default images for locations - in a real app, these would be actual images from your content
const defaultImages = {
  london: '/images/locations/london.jpg',
  kings_cross: '/images/locations/kings_cross.jpg',
  leadenhall: '/images/locations/leadenhall.jpg',
  millennium_bridge: '/images/locations/millennium_bridge.jpg',
  northumberland: '/images/locations/northumberland.jpg',
  alnwick: '/images/locations/alnwick_castle.jpg',
  glenfinnan: '/images/locations/glenfinnan.jpg',
  glencoe: '/images/locations/glencoe.jpg',
  oxford: '/images/locations/oxford.jpg',
  christ_church: '/images/locations/christ_church.jpg',
  bodleian: '/images/locations/bodleian.jpg',
  new_college: '/images/locations/new_college.jpg',
  gloucestershire: '/images/locations/gloucestershire.jpg',
  gloucester: '/images/locations/gloucester_cathedral.jpg',
  lacock: '/images/locations/lacock_abbey.jpg'
};

// Fallback images if the above aren't available
const fallbackImages = {
  london: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad',
  kings_cross: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf',
  leadenhall: 'https://images.unsplash.com/photo-1603659514658-52353fcd2e8f',
  millennium_bridge: 'https://images.unsplash.com/photo-1596268838797-edc458e29ce5',
  northumberland: 'https://images.unsplash.com/photo-1575573330500-12664ef7693f',
  alnwick: 'https://images.unsplash.com/photo-1589489873423-d1745278a8f3',
  glenfinnan: 'https://images.unsplash.com/photo-1599597435338-adbf0f27b5b7',
  glencoe: 'https://images.unsplash.com/photo-1583102916215-30036bc32705',
  oxford: 'https://images.unsplash.com/photo-1581414211938-e772a180c7ab',
  christ_church: 'https://images.unsplash.com/photo-1571680322018-63b6583853b7',
  bodleian: 'https://images.unsplash.com/photo-1589818276093-f5f143201ebf',
  new_college: 'https://images.unsplash.com/photo-1624005340892-c4504b4146bb',
  gloucestershire: 'https://images.unsplash.com/photo-1619641384395-d88316a0fd1d',
  gloucester: 'https://images.unsplash.com/photo-1608628920989-703546462541',
  lacock: 'https://images.unsplash.com/photo-1616187374314-6aa0b1c14ba7'
};

// Helper function to get the best available image
const getImage = (key: keyof typeof defaultImages) => {
  // Check if image exists in public folder (in production)
  // This is a simplification - in a real app you'd use a more robust method
  try {
    const img = new Image();
    img.src = defaultImages[key];
    return img.complete ? defaultImages[key] : fallbackImages[key];
  } catch {
    return fallbackImages[key];
  }
};

const HarryPotterGuide: React.FC = () => {
  const title = "Harry Potter Filming Locations";
  const intro = "The Harry Potter film series (2001-2011) transformed numerous locations across the United Kingdom into the magical world created by J.K. Rowling. From historic castles and cathedrals to modern urban settings, these places continue to attract fans from around the world seeking to experience a bit of the wizarding magic firsthand.";
  
  const regions = [
    {
      name: "London, England",
      description: "England's capital features prominently throughout the series, with several iconic locations.",
      image: getImage('london'),
      locations: [
        {
          name: "King's Cross Station",
          description: "The real King's Cross Station was used for scenes featuring Platform 9¾, where students board the Hogwarts Express. Today, fans can visit a dedicated Platform 9¾ installation with a trolley \"disappearing\" into the wall.",
          image: getImage('kings_cross')
        },
        {
          name: "Leadenhall Market",
          description: "This beautiful covered Victorian market in London served as the exterior filming location for Diagon Alley in the first film. The entrance to the Leaky Cauldron was shot at an optician's shop at the Bull's Head Passage entrance.",
          image: getImage('leadenhall')
        },
        {
          name: "Millennium Bridge",
          description: "The dramatic opening of \"Harry Potter and the Half-Blood Prince\" shows Death Eaters destroying London's Millennium Bridge, despite the bridge not existing when the book was set.",
          image: getImage('millennium_bridge')
        }
      ]
    },
    {
      name: "Northumberland & Scotland",
      description: "Many of Hogwarts' exterior shots were filmed in northern England and Scotland.",
      image: getImage('northumberland'),
      locations: [
        {
          name: "Alnwick Castle",
          description: "The second largest inhabited castle in England served as Hogwarts School of Witchcraft and Wizardry in the first two films. The Outer Bailey is where Harry and his classmates took their first flying lessons.",
          image: getImage('alnwick')
        },
        {
          name: "Glenfinnan Viaduct",
          description: "This spectacular railway viaduct in the Scottish Highlands is crossed by the Hogwarts Express in several films. The Jacobite Steam Train that runs on this route during summer months closely resembles the film's magical train.",
          image: getImage('glenfinnan')
        },
        {
          name: "Glencoe",
          description: "The dramatic landscapes of Glencoe were used extensively in \"Prisoner of Azkaban\" and subsequent films for the grounds surrounding Hogwarts, including Hagrid's hut location.",
          image: getImage('glencoe')
        }
      ]
    },
    {
      name: "Oxford, England",
      description: "Several Oxford University locations provided interiors for Hogwarts.",
      image: getImage('oxford'),
      locations: [
        {
          name: "Christ Church College",
          description: "The grand staircase leading to the Great Hall was used as the entrance to Hogwarts, and the college's dining hall inspired the design of the Great Hall set built at Leavesden Studios.",
          image: getImage('christ_church')
        },
        {
          name: "Bodleian Library",
          description: "The medieval Duke Humfrey's Library served as Hogwarts' library, while the Divinity School with its elaborate ceiling became the Hogwarts infirmary.",
          image: getImage('bodleian')
        },
        {
          name: "New College",
          description: "The cloisters and courtyard appeared in \"Goblet of Fire\" during scenes where Harry navigates his challenging relationship with the student body.",
          image: getImage('new_college')
        }
      ]
    },
    {
      name: "Gloucestershire & Wiltshire",
      description: "Several historic buildings in these counties provided key Hogwarts interiors.",
      image: getImage('gloucestershire'),
      locations: [
        {
          name: "Gloucester Cathedral",
          description: "The cathedral's cloisters were transformed into Hogwarts corridors for several films, featuring the memorable \"writing on the wall\" scene in \"Chamber of Secrets.\"",
          image: getImage('gloucester')
        },
        {
          name: "Lacock Abbey",
          description: "This historic building was used for various Hogwarts interior scenes, including Professor Snape's potions classroom and some corridor scenes.",
          image: getImage('lacock')
        }
      ]
    }
  ];

  return (
    <>
      <LocationsGuide title={title} intro={intro} regions={regions} />
      
      {/* Travel Tips and Trivia Sections */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Travel Tips Card */}
        <div className="bg-blue-50 rounded-xl shadow-sm p-6 border border-blue-100">
          <h3 className="text-2xl font-bold text-blue-800 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
            </svg>
            Travel Tips
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p>The Warner Bros. Studio Tour near London offers the most comprehensive Harry Potter experience, featuring original sets, costumes, and props from the films.</p>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p>Many specialized Harry Potter walking tours operate in London, Oxford, and Edinburgh (where Rowling wrote much of the series).</p>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p>The Jacobite Steam Train runs from Fort William to Mallaig in Scotland, crossing the Glenfinnan Viaduct just like the Hogwarts Express.</p>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p>Most filming locations are active historic sites or educational institutions, so check opening times and visitor policies before traveling.</p>
            </li>
          </ul>
        </div>
        
        {/* Trivia Card */}
        <div className="bg-amber-50 rounded-xl shadow-sm p-6 border border-amber-100">
          <h3 className="text-2xl font-bold text-amber-800 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
            Trivia
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <svg className="w-5 h-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
              </svg>
              <p>The Great Hall at Hogwarts was inspired by the dining hall at Christ Church College, Oxford, but was entirely constructed as a set at Leavesden Studios.</p>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
              </svg>
              <p>Though scenes were filmed at King's Cross Station, the iconic wall between platforms 9 and 10 from the films was actually shot at platforms 4 and 5, as the real platforms 9 and 10 are separated by tracks.</p>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
              </svg>
              <p>Leavesden Studios, where much of the series was filmed, is now permanently home to the Warner Bros. Studio Tour London - The Making of Harry Potter.</p>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
              </svg>
              <p>Gloucester Cathedral staff requested that no references to witchcraft or magic appear in the cathedral itself during filming.</p>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
              </svg>
              <p>The "snow" seen in Hogsmeade Village scenes at the studio sets is actually salt, while the "snow" during outdoor location filming was often a mixture of paper and polymers.</p>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default HarryPotterGuide; 