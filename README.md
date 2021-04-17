# Endpoints
## Types
 - AUTH_TOKEN: A token recieved from /players/token/email/{email}/password/{password}
 - OPTIONAL: This field of the body is optional
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
 
## /forces
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

  + ***Return:*** Status code 200 and the location of this force in the form of /forces/{id}

### PUT
- #### /forces/update

  + ***Purpose:***
  + ***Body:***
  
    * token: AUTH_TOKEN

  + ***Return:*** Status code 200
- #### /forces/add/supply_used

  + ***Purpose:*** 
  + ***Body:***
  
    * token: AUTH_TOKEN

  + ***Return:*** Status code 200 
- #### /forces/subtract/supply_used

  + ***Purpose:*** 
  + ***Body:***
  
    * token: AUTH_TOKEN

  + ***Return:*** Status code 200 
- #### /forces/add/supply_limit

  + ***Purpose:*** 
  + ***Body:***
  
    * token: AUTH_TOKEN

  + ***Return:*** Status code 200 
- #### /forces/subtract/supply_limit

  + ***Purpose:*** 
  + ***Body:***
  
    * token: AUTH_TOKEN

  + ***Return:*** Status code 200 
- #### /forces/add/requisition_points

  + ***Purpose:*** 
  + ***Body:***
  
    * token: AUTH_TOKEN

  + ***Return:*** Status code 200 
- #### /forces/subtract/requisition_points

  + ***Purpose:*** 
  + ***Body:***
  
    * token: AUTH_TOKEN

  + ***Return:*** Status code 200 
- #### /forces/add/battle_tally

  + ***Purpose:*** 
  + ***Body:***
  
    * token: AUTH_TOKEN

  + ***Return:*** Status code 200 
- #### /forces/subtract/battle_tally

  + ***Purpose:*** 
  + ***Body:***
  
    * token: AUTH_TOKEN

  + ***Return:*** Status code 200 
- #### /forces/add/battles_won

  + ***Purpose:*** 
  + ***Body:***
  
    * token: AUTH_TOKEN

  + ***Return:*** Status code 200 
- #### /forces/subtract/battles_won

  + ***Purpose:*** 
  + ***Body:***
  
    * token: AUTH_TOKEN

  + ***Return:*** Status code 200 
### DELETE
- #### /forces/delete

  + ***Purpose:*** 
  + ***Body:***
  
    * token: AUTH_TOKEN

  + ***Return:*** Status code 200 
## /goals
### GET
### POST
### PUT
### DELETE
## /information
### GET
### POST
### PUT
### DELETE
## /players
### GET
### POST
### PUT
### DELETE
## /ranks
### GET
### POST
### PUT
### DELETE
## /roles
### GET
### POST
### PUT
### DELETE
## /supply_types
### GET
### POST
### PUT
### DELETE
## /units
### GET
### POST
### PUT
### DELETE
## /victories
### GET
### POST
### PUT
### DELETE




///
  + ***Purpose:***
  + ***Body:***
  
    * 

  + ***Return:***

