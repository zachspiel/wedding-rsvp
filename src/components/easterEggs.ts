const weddingDateString = `
----------------------------------------------------------
                                 _      Zach and Sedona
          ___            {@}   _|=|_
         /___\\          /(")\\   (")
       .---'-'---.     /((~))\\ /<x>\\        _   .-.
      /___________\\    ~~/@\\~~ \\|_|/       <v> ((_))
      | A /^\\ A |       /   \\   |||       ((_)) '-'
      |   |"|   |      /~@~@~\\  |||        '-'
  ____|___|_|___|_____/_______\\ |||___October 26th 2024___
 `;

const displayEasterEggs = () => {
  console.log(weddingDateString);
  console.log(
    "Hello! Hopefully you won't find too much down here, but for more information regarding the tech stack please go here: https://github.com/zachspiel/wedding-rsvp"
  );
  console.log(
    "If you notice a 🐛, please report it to the GitHub repo above. Thank you!"
  );
};

export { displayEasterEggs };
