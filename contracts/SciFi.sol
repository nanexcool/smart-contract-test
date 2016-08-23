contract SciFi {

  // Contract owner
  address public owner;

  struct Movie {
    bytes32 name; //short name (up to 32 bytes)
    uint voteCount; // number of accumulated votes 
    uint bid; // amount voted
    address owner; // first person who voted for this movie
  }

  // TODO: can this be a dynamic array?
  bytes32[1000000] public movie_names;

  mapping(bytes32 => Movie) public movies;

  uint public movie_count;

  function SciFi() {
    owner = msg.sender;
  }

  function vote(bytes32 name) {
    if (msg.value == 0)
      return;

    // Check if movie index exists
    Movie movie = movies[name];

    if (movie.voteCount == 0) {
      // Create movie
      movie.name = name;
      movie.voteCount++;
      // TODO: make creating a movie an internal function...
      movie.bid += msg.value;
      movie.owner = msg.sender;

      // Add movie to names array and increase movie count
      movie_names[movie_count++] = name;
    }
    else {
      movie.voteCount++;
      movie.bid += msg.value;
    }
  }

  function withdraw(bytes32 name) returns (bool ret) {
    Movie movie = movies[name];

    if (movie.owner == msg.sender) {
      if (msg.sender.send(movie.bid)) {
        movie.bid = 0;
        return true;
      }
    }
    return false;
  }

}