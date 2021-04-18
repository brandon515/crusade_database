# Endpoints
## Types
 - AUTH_TOKEN: A token recieved from /players/token/email/{email}/password/{password}
 - OPTIONAL: This field of the body is optional, however one of the optional field is neccesary
## Battles
### OBJECT
```
{
  battle_id: INT id of current battle,
  d_psychic_powers: INT number of enemy units destroyed with psychic powers in this battle by this unit,
  d_ranged: INT number of enemy units destroyed with ranged weapons in this battle by this unit,
  d_melee: INT number of enemy units destroyed with melee weapons in this battle by this unit,
  agenda_1: INT tally of how many times this unit accomplished the first agenda in this battle,
  agenda_2: INT tally of how many times this unit accomplished the second agenda in this battle,
  agenda_3: INT tally of how many times this unit accomplished the third agenda in this battle,
  victory: BOOLEAN TRUE if the associated unit was victorious in this battle, FALSE if they were not victorious,
  unit: STRING name of the associated unit,
  force: STRING name of the force associated with the above unit,
  unit_id: INT id of the unit associated with this battle,
  force_id: INT id of the force that contains the unit associated with this battle,
}
```
### GET
- #### /battles/

  + ***Purpose:*** Retrieve all battles in relation
  + ***Return:*** An array of battle objects
  
- #### /battles/{id}

  + ***Purpose:*** Retrieve specific battle with provided {id}
  + ***Return:*** A battle object
 
- #### /battles/unit/{id}

  + ***Purpose:*** Retrieve all battles assiciated with unit that has the provided {id}
  + ***Return:*** An array of battle objects

- #### /battles/force/{id}

  + ***Purpose:*** Retrieve all battles assiciated with the force that has the provided {id}
  + ***Return:*** An array of battle objects

### POST
- #### /battles/create

  + ***Purpose:*** Create a new battle
  + ***Body:***
  
    * token: AUTH_TOKEN
    * unit: INT unit id who fought the battle
    * d_psychic_powers: INT number of enemy units destroyed with psychic powers in this battle by this unit,
    * d_ranged: INT number of enemy units destroyed with ranged weapons in this battle by this unit,
    * d_melee: INT number of enemy units destroyed with melee weapons in this battle by this unit,
    * agenda_1: INT tally of how many times this unit accomplished the first agenda in this battle,
    * agenda_2: INT tally of how many times this unit accomplished the second agenda in this battle,
    * agenda_3: INT tally of how many times this unit accomplished the third agenda in this battle,
    * victory: BOOLEAN TRUE if the associated unit was victorious in this battle, FALSE if they were not victorious,

  + ***Return:*** 201 status with the url endpoint to retrieve this battle in the form of /battles/{id}

### PUT
- #### /battles/update

  + ***Purpose:*** Update a column of a battle, if the column isn't included in the body than it won't be updated
  + ***Body:*** 1 or more column is required
  
    * token: AUTH_TOKEN
    * id: INT the id of the battle that is being updated
    * d_psychic_powers: INT OPTIONAL number of enemy units destroyed with psychic powers in this battle by this unit,
    * d_ranged: INT OPTIONAL number of enemy units destroyed with ranged weapons in this battle by this unit,
    * d_melee: INT OPTIONAL number of enemy units destroyed with melee weapons in this battle by this unit,
    * agenda_1: INT OPTIONAL tally of how many times this unit accomplished the first agenda in this battle,
    * agenda_2: INT OPTIONAL tally of how many times this unit accomplished the second agenda in this battle,
    * agenda_3: INT OPTIONAL tally of how many times this unit accomplished the third agenda in this battle,
    * victory: BOOLEAN OPTIONAL TRUE if the associated unit was victorious in this battle, FALSE if they were not victorious,

  + ***Return:*** Status code 200

- #### /battles/add/d_psychic_powers

  + ***Purpose:*** Add 1 to the tally of enemies defeated by psychic powers
  + ***Body:***
  
    * token: AUTH_TOKEN
    * id: INT The id for the battle

  + ***Return:*** Status code 200

- #### /battles/subtract/d_psychic_powers

  + ***Purpose:*** Subtract 1 to the tally of enemies defeated by psychic powers
  + ***Body:***
  
    * token: AUTH_TOKEN
    * id: INT The id for the battle

  + ***Return:*** Status code 200

- #### /battles/add/d_ranged

  + ***Purpose:*** Add 1 to the tally of enemies defeated with ranged weapons
  + ***Body:***
  
    * token: AUTH_TOKEN
    * id: INT The id for the battle

  + ***Return:*** Status code 200

- #### /battles/subtract/d_ranged

  + ***Purpose:*** Subtract 1 to the tally of enemies defeated with ranged weapons
  + ***Body:***
  
    * token: AUTH_TOKEN
    * id: INT The id for the battle

  + ***Return:*** Status code 200

- #### /battles/add/d_melee

  + ***Purpose:*** Add 1 to the tally of enemies defeated with melee weapons
  + ***Body:***
  
    * token: AUTH_TOKEN
    * id: INT The id for the battle

  + ***Return:*** Status code 200

- #### /battles/subtract/d_melee

  + ***Purpose:*** Subtract 1 to the tally of enemies defeated with melee weapons
  + ***Body:***
  
    * token: AUTH_TOKEN
    * id: INT The id for the battle

  + ***Return:*** Status code 200

- #### /battles/add/agenda_1

  + ***Purpose:*** Add 1 to the tally of how many times the unit accomplished the first agenda
  + ***Body:***
  
    * token: AUTH_TOKEN
    * id: INT The id for the battle

  + ***Return:*** Status code 200

- #### /battles/subtract/agenda_1

  + ***Purpose:*** Subtract 1 to the tally of how many times the unit accomplished the first agenda
  + ***Body:***
  
    * token: AUTH_TOKEN
    * id: INT The id for the battle

  + ***Return:*** Status code 200

- #### /battles/add/agenda_2

  + ***Purpose:*** Add 1 to the tally of how many times the unit accomplished the second agenda
  + ***Body:***
  
    * token: AUTH_TOKEN
    * id: INT The id for the battle

  + ***Return:*** Status code 200

- #### /battles/subtract/agenda_2

  + ***Purpose:*** Subtract 1 to the tally of how many times the unit accomplished the second agenda
  + ***Body:***
  
    * token: AUTH_TOKEN
    * id: INT The id for the battle

  + ***Return:*** Status code 200

- #### /battles/add/agenda_3

  + ***Purpose:*** Add 1 to the tally of how many times the unit accomplished the third agenda
  + ***Body:***
  
    * token: AUTH_TOKEN
    * id: INT The id for the battle

  + ***Return:*** Status code 200

- #### /battles/subtract/agenda_3

  + ***Purpose:*** Subtract 1 to the tally of how many times the unit accomplished the third agenda
  + ***Body:***
  
    * token: AUTH_TOKEN
    * id: INT The id for the battle

  + ***Return:*** Status code 200

### DELETE
- #### /battles/delete

  + ***Purpose:*** Delete a battle
  + ***Body:***
  
    * token: AUTH_TOKEN
    * id: INT The id for the battle

  + ***Return:*** Status code 200

## Factions
### OBJECT
```
{
  faction_id: INT the id of the faction
  name: STRING the name of the faction
  description: STRING a short description of the faction
}
```
### GET
- #### /factions/

  + ***Purpose:*** Retrieve all factions in relation
  + ***Return:*** An array of faction objects
  
- #### /factions/{id}

  + ***Purpose:*** Retrieve specific faction with provided {id}
  + ***Return:*** A faction object
 
## Forces
### OBJECT
```
{
  force_id: INT the id of the force
  name: STRING the name of the force
  battle_tally: INT a tally of the total battles this force has fought
  battles_won: INT a tally of the total battles this force has won
  requisition_points: INT number of requision points this force has
  supply_limit: INT the supply limit of this force
  supply_used: INT the total amount of supply used 
  faction_id: INT the id of the faction of the force
  faction: STRING the name of the faction
  owner_id: INT the id of the player who owns this force
  owner: STRING the name of the player who owns this force
}
```
### GET
- #### /forces/

  + ***Purpose:*** Retrieve all forces in relation
  + ***Return:*** An array of force objects
  
- #### /forces/{id}

  + ***Purpose:*** Retrieve specific force with provided {id}
  + ***Return:*** A force object

- #### /forces/player/{id}

  + ***Purpose:*** Retrieve forces that are owned by the player associated with {id}
  + ***Return:*** An array of force objects

### POST
- #### /forces/create

  + ***Purpose:*** Create a new force
  + ***Body:***
  
    * token: AUTH_TOKEN
    * faction_id: INT a faction_id from a row of factions table
    * supply_type: INT a type_id from a row of supply_types table
    * name: STRING the name of this force

  + ***Return:*** Status code 201 and location on where to retrieve the created row in the location of the status body

### PUT
- #### /forces/update

  + ***Purpose:*** Update various columns in the specified force
  + ***Body:***
  
    * token: AUTH_TOKEN
    * id: INT the id of the force being updated
    * name: STRING OPTIONAL the name of this force
    * battle_tally: INT OPTIONAL the tally of battles fought by this force
    * battles_won: INT OPTIONAL the tally of battles won by this force
    * requisition_points: INT OPTIONAL the number of points this force currently has
    * supply_limit: INT OPTIONAL the supply that this force can use
    * supply_used: INT OPTIONAL the amount of supply used by this force
    * faction_id: INT OPTIONAL the id of the faction this force belongs to
    * supply_type: INT OPTIONAL the type of supply this force uses, either points or power level

  + ***Return:*** Status code 200

- #### /forces/add/supply_used

  + ***Purpose:*** Shorthand endpoint to add to the supply used, it will return a status code 405 if the new amount is more than the supply limit
  + ***Body:***
  
    * token: AUTH_TOKEN
    * id: INT the id of the force
    * amount: INT the amount that the supply_used is to be changed

  + ***Return:*** Status code 200 

- #### /forces/subtract/supply_used

  + ***Purpose:*** Shorthand endpoint to subtract from the supply used, it silently set it to 0 if the subtracted amount is lower than 0
  + ***Body:***
  
    * token: AUTH_TOKEN
    * id: INT the id of the force
    * amount: INT the amount that the supply_used is to be changed

  + ***Return:*** Status code 200 

- #### /forces/add/supply_limit

  + ***Purpose:*** Shorthand endpoint to add to the supply limit, there is no upper limit to this
  + ***Body:***
  
    * token: AUTH_TOKEN
    * id: INT the id of the force
    * amount: INT the amount that the supply_used is to be changed

  + ***Return:*** Status code 200 

- #### /forces/subtract/supply_limit

  + ***Purpose:*** Shorthand endpoint to subtract from the supply limit, it silently set it to 0 if the subtracted amount is lower than 0
  + ***Body:***
  
    * token: AUTH_TOKEN
    * id: INT the id of the force
    * amount: INT the amount that the supply_used is to be changed

  + ***Return:*** Status code 200 

- #### /forces/add/requisition_points

  + ***Purpose:*** Shorthand endpoint to add to the requisition points, it returns status code 405 if the new amount is more than 5
  + ***Body:***
  
    * token: AUTH_TOKEN
    * id: INT the id of the force
    * amount: INT the amount that the supply_used is to be changed

  + ***Return:*** Status code 200 

- #### /forces/subtract/requisition_points

  + ***Purpose:*** Shorthand endpoint to subtract from the requisition points, it silently set it to 0 if the subtracted amount is lower than 0
  + ***Body:***
  
    * token: AUTH_TOKEN
    * id: INT the id of the force
    * amount: INT the amount that the supply_used is to be changed

  + ***Return:*** Status code 200
 
- #### /forces/add/battle_tally

  + ***Purpose:*** Shorthand endpoint to add to the  battle tally, there is not upper limit to this
  + ***Body:***
  
    * token: AUTH_TOKEN
    * id: INT the id of the force
    * amount: INT the amount that the supply_used is to be changed

  + ***Return:*** Status code 200

- #### /forces/subtract/battle_tally

  + ***Purpose:*** Shorthand endpoint to subtract from the battle tally, it silently set it to 0 if the subtracted amount is lower than 0
  + ***Body:***
  
    * token: AUTH_TOKEN
    * id: INT the id of the force
    * amount: INT the amount that the supply_used is to be changed

  + ***Return:*** Status code 200 

- #### /forces/add/battles_won

  + ***Purpose:*** Shorthand endpoint to add to the  battles won, it will return status code 405 if more than battle tally
  + ***Body:***
  
    * token: AUTH_TOKEN
    * id: INT the id of the force
    * amount: INT the amount that the supply_used is to be changed

  + ***Return:*** Status code 200

- #### /forces/subtract/battles_won

  + ***Purpose:*** Shorthand endpoint to subtract from the battles won, it silently set it to 0 if the subtracted amount is lower than 0
  + ***Body:***
  
    * token: AUTH_TOKEN
    * id: INT the id of the force
    * amount: INT the amount that the supply_used is to be changed

  + ***Return:*** Status code 200

### DELETE
- #### /forces/delete

  + ***Purpose:*** Deletes this force
  + ***Body:***
  
    * token: AUTH_TOKEN
    * id: INT id of the force to be deleted

  + ***Return:*** Status code 200 

## Goals
### OBJECT
```
{
  goal_id: INT unique id of goal
  text: STRING the description of the goal
  title: STRING a short summary of the goal
  force: INT the id of the force from the force table
  created_at: TIMESTAMP the time that this goal was entered into the database
}
```
### GET
- #### /goals/

  + ***Purpose:*** Retrieve all goals in relation
  + ***Return:*** An array of goal objects
  
- #### /goals/{id}

  + ***Purpose:*** Retrieve specific goal with provided {id}
  + ***Return:*** A goal object

- #### /goals/force/{id}

  + ***Purpose:*** Retrieve goals that are owned by the force associated with {id}
  + ***Return:*** An array of goal objects

### POST
- #### /goals/create

  + ***Purpose:*** Creates a new goal
  + ***Body:***
  
    * token: AUTH_TOKEN
    * force: INT An id from the force table of the force that this goal is associated with
    * title: STRING A one line summary of the goal
    * text: STRING An in depth description of the goal

  + ***Return:*** Status code 201 and location on where to retrieve the created row in the location of the status body

### PUT
- #### /goals/update

  + ***Purpose:*** Updates various columns in a goal
  + ***Body:***
  
    * token: AUTH_TOKEN
    * id: INT the id of the goal to be updated
    * title: STRING OPTIONAL A one line summary of the goal
    * text: STRING OPTIONAL An in depth description of the goal

  + ***Return:*** Status code 200 

### DELETE
- #### /goals/delete

  + ***Purpose:*** Deletes a goal
  + ***Body:***
  
    * token: AUTH_TOKEN
    * id: INT the id of the goal to be deleted

  + ***Return:*** Status code 200 

## Information
### OBJECT
```
{
  information_id: INT unique id of the piece of information
  text: STRING the description of the piece of information
  title: STRING a short summary of the piece of information
  force: INT the id of the force from the force table
  created_at: TIMESTAMP the time that this piece of information was entered into the database
}
```
### GET
- #### /information/

  + ***Purpose:*** Retrieve all information in relation
  + ***Return:*** An array of information objects
  
- #### /information/{id}

  + ***Purpose:*** Retrieve a specific piece of information with provided {id}
  + ***Return:*** A information object

- #### /information/force/{id}

  + ***Purpose:*** Retrieve information that are owned by the force associated with {id}
  + ***Return:*** An array of information objects

### POST
- #### /information/create

  + ***Purpose:*** Creates a new piece of information
  + ***Body:***
  
    * token: AUTH_TOKEN
    * force: INT An id from the force table of the force that this piece of information is associated with
    * title: STRING A one line summary of the piece of information
    * text: STRING An in depth description of the piece of information

  + ***Return:*** Status code 201 and location on where to retrieve the created row in the location of the status body

### PUT
- #### /information/update

  + ***Purpose:*** Updates various columns in a piece of information
  + ***Body:***
  
    * token: AUTH_TOKEN
    * id: INT the id of the piece of information to be updated
    * title: STRING OPTIONAL A one line summary of the piece of information
    * text: STRING OPTIONAL An in depth description of the piece of information

  + ***Return:*** Status code 200 

### DELETE
- #### /information/delete

  + ***Purpose:*** Deletes a piece of information
  + ***Body:***
  
    * token: AUTH_TOKEN
    * id: INT the id of the piece of information to be deleted

  + ***Return:*** Status code 200 

## Players
### OBJECT
```
{
  player_id: INT the id of the player
  display_name: STRING the name of the player
  email: STRING the email of the player
}
```
### GET
- #### /players/

  + ***Purpose:*** Retrieve all players in relation
  + ***Return:*** An array of player objects

- #### /players/{id}

  + ***Purpose:*** Retrieve specific player with provided {id}
  + ***Return:*** A player object

- #### /players/token/email/{email}/password/{password}

  + ***Purpose:*** Retrieve an AUTH_TOKEN
  + ***Return:*** An AUTH_TOKEN

### POST
- #### /players/create

  + ***Purpose:*** Creates a player
  + ***Body:***
  
    * display_name: STRING The display name of the new player
    * email: STRING The email of the new player
    * password: STRING The password of the new player

  + ***Return:*** Status code 201 and location on where to retrieve the created row in the location of the status body

### PUT
- #### /players/update

  + ***Purpose:*** Updates various columns in a specific player
  + ***Body:***
  
    * token: AUTH_TOKEN
    * display_name: STRING OPTIONAL The value for diplay name to be changed to
    * email: STRING OPTIONAL The value for email to be changed to
    * password: STRING OPTIONAL The value for password to be changed to 

  + ***Return:*** Status code 200 

### DELETE
- #### /players/delete

  + ***Purpose:*** Deletes a player
  + ***Body:***
  
    * token: AUTH_TOKEN

  + ***Return:*** Status code 200 

## Ranks
### OBJECT
```
{
  rank_id: INT the id of the rank
  name: STRING the name of the rank
}
```
### GET
- #### /ranks/

  + ***Purpose:*** Retrieve all ranks in relation
  + ***Return:*** An array of rank objects
  
- #### /ranks/{id}

  + ***Purpose:*** Retrieve specific rank with provided {id}
  + ***Return:*** A rank object
 
## Roles
### OBJECT
```
{
  role_id: INT the id of the role
  name: STRING the name of the role
}
```
### GET
- #### /roles/

  + ***Purpose:*** Retrieve all roles in relation
  + ***Return:*** An array of role objects
  
- #### /roles/{id}

  + ***Purpose:*** Retrieve specific role with provided {id}
  + ***Return:*** A role object
 
## Supply Types
### OBJECT
```
{
  role_id: INT the id of the supply type
  name: STRING the name of the supply type
}
```
### GET
- #### /supply_types/

  + ***Purpose:*** Retrieve all supply types in relation
  + ***Return:*** An array of supply type objects
  
- #### /supply_types/{id}

  + ***Purpose:*** Retrieve specific supply type with provided {id}
  + ***Return:*** A supply type object
 
## /unit
### OBJECT
```
{
  unit_id: INT the id of the unit
  name: STRING the name of the unit
  keywords: STRING the unit's selectable keywords, such as dynasty or chapter
  unit_type: STRING name of the unit from the datasheet (such as Necron Warriors or Primaris intercessors)
  equipment: STRING the list of selectable equpiment on the models of the unit
  psychic_powers: STRING a list of powers known to the unit if they are psykers
  warlord_traits: STRING the warlord traits of this unit if it is a warlord
  power_rating: INT the power of the unit, either in points or power level
  experience_points: INT the exp of the unit
  crusade_points: INT an accumulation of things as the unit fights, usually the relics or requisition will say how many points it adds
  other_abilities: STRING anything that's not covered above, such as C'Tan powers
  battle_honors: STRING battles honors earned through victories
  battle_scars: STRING battles scars earned through defeat
  relics: STRING the relics this unit has collected throughout the crusade
  faction: STRING the name of the faction this unit belongs to
  faction_des: STRING the description of the faction this unit belongs to
  role: STRING the battefield role this unit occupies such as troop or HQ
  rank: STRING name of the rank that this unit as attained
  force: STRING name of the force this unit belongs to
  force_id: INT the id of the force that this unit belongs to
}
```
### GET
- #### /units/

  + ***Purpose:*** Retrieve all units in relation
  + ***Return:*** An array of unit objects

- #### /units/{id}

  + ***Purpose:*** Retrieve specific unit with provided {id}
  + ***Return:*** A unit object

- #### /units/force/{id}

  + ***Purpose:*** Retrieve an AUTH_TOKEN
  + ***Return:*** An AUTH_TOKEN

### POST
- #### /units/create

  + ***Purpose:*** Creates a unit
  + ***Body:***
  
    * token: AUTH_TOKEN
    * name: STRING The name of the new unit
    * role: STRING The role of the new unit
    * faction: INT The id of the faction that this unit belongs to
    * keywords: STRING Selectable keywords
    * unit_type: STRING The name of the unit from the codex
    * equipment: STRING the list of selectable equpiment that this unit uses
    * power_rating: INT the power_rating of this unit, either points or power level
    * other_abilities: STRING any abilities not handled above
    * rank: INT id from the rank table
    * battle_honors: STRING a list of battles honors
    * battle_scars: STRING a list of battle scars
    * relics: STRING a list of relics
    * force: INT the id from the forces table

  + ***Return:*** Status code 201 and location on where to retrieve the created row in the location of the status body

### PUT
- #### /units/update

  + ***Purpose:*** Updates various columns in a specific unit
  + ***Body:***
  
    * token: AUTH_TOKEN
    * id: INT the id of the unit to be updated
    * name: STRING OPTIONAL display name of the unit
    * faction: INT OPTIONAL id from factions table
    * keywords: STRING OPTIONAL
    * unit_type: STRING OPTIONAL
    * equipment: STRING OPTIONAL
    * psychic_powers: STRING OPTIONAL
    * warlord_traits: STRING OPTIONAL
    * power_rating: INT OPTIONAL
    * crusade_points: INT OPTIONAL
    * experience_points: INT OPTIONAL
    * other_abilities: STRING OPTIONAL
    * rank: INT OPTIONAL id from rank table
    * battle_honors: STRING OPTIONAL
    * battle_scars: STRING OPTIONAL
    * relics: STRING OPTIONAL

  + ***Return:*** Status code 200 

### DELETE
- #### /units/delete

  + ***Purpose:*** Deletes a unit
  + ***Body:***
  
    * token: AUTH_TOKEN
    * id: INT the id of the unit to be deleted

  + ***Return:*** Status code 200 

## Victories
### OBJECT
```
{
  victory_id: INT unique id of the victory
  text: STRING the description of the victory
  title: STRING a short summary of the victory
  force: INT the id of the force from the force table
  created_at: TIMESTAMP the time that this victory was entered into the database
}
```
### GET
- #### /victories/

  + ***Purpose:*** Retrieve all victories in relation
  + ***Return:*** An array of victories objects
  
- #### /victories/{id}

  + ***Purpose:*** Retrieve a specific victory with provided {id}
  + ***Return:*** A victories object

- #### /victories/force/{id}

  + ***Purpose:*** Retrieve victories that are owned by the force associated with {id}
  + ***Return:*** An array of victories objects

### POST
- #### /victories/create

  + ***Purpose:*** Creates a new victory
  + ***Body:***
  
    * token: AUTH_TOKEN
    * force: INT An id from the force table of the force that this victory is associated with
    * title: STRING A one line summary of the victory
    * text: STRING An in depth description of the victory

  + ***Return:*** Status code 201 and location on where to retrieve the created row in the location of the status body

### PUT
- #### /victories/update

  + ***Purpose:*** Updates various columns in a victory
  + ***Body:***
  
    * token: AUTH_TOKEN
    * id: INT the id of the victory to be updated
    * title: STRING OPTIONAL A one line summary of the victory
    * text: STRING OPTIONAL An in depth description of the victory

  + ***Return:*** Status code 200 

### DELETE
- #### /victories/delete

  + ***Purpose:*** Deletes a victory
  + ***Body:***
  
    * token: AUTH_TOKEN
    * id: INT the id of the victory to be deleted

  + ***Return:*** Status code 200 
