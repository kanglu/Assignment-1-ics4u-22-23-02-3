# Instructions

### Intro

Around 1000 movies are released each year, with each containing around 10 main and supporting characters. IMDb is an online database of information related to films and other mediums of entertainment. Over the years, they have collected thousands of entries on actors alone. 
### Your Task
Create a GUI to :
Allow your users to search for actors based on the actor’s full name or actorID. 
Users can also search for films using the film’s name, filmID or the year it was released
Display your search results on the screen. If an actor was searched, display all the films they were in along with the film’s release dates. Each film is displayed one by one.
If a film was searched, display which year it was released, its rating, number of votes from users, and all the actors that participated in the film.
Users can search for results in lower case, upper case, or all caps. If no search results show up then display an error message.
Have a second page where all the information is listed in tabular form.
The table can be sorted by each of the 7 categories (ascending or descending)


Your program must perform searches and sorts as quickly as possible
Provide the asymptotic bound for each of the functions.
Every time your application performs an action (such as searching), use performance.now() to record the time it takes to complete the action. Display this number back to the user. 

### Bonus 1 (+ 1%) - Alpha Omega
Users can search for actors using their first or last name as well. They do not have to select another category when searching to do so. The program should know when a search is not a full name. If multiple actors share the same name, first provide a list of results with that name.

### Bonus 2 (+ 4%) - Hit List
Users can login. When they are logged it, they can create a favourite actors list, and a favourite films list. 

### Bonus 3 (+ 5%) - 6 Degrees of Kevin Bacon
https://en.wikipedia.org/wiki/Six_Degrees_of_Kevin_Bacon#:~:text=Six%20Degrees%20of%20Kevin%20Bacon%20or%20Bacon's%20Law%20is%20a,ultimately%20leads%20to%20prolific%20American

Create a function where users can search for two actors and it returns the shortest number of jumps via movies until the two actors are linked to one another. An actor to themselves would be a jump (or Bacon number) of 0. Neither actor has to be Kevin Bacon.

