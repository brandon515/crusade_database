# Endpoints
## Types
 - AUTH_TOKEN: a token recieved from /players/token/email/{email}/password/{password}
## /battles
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
- #### /

  + ***Purpose:*** Retrieves all battles in relation
  + ***Return:*** An array of battle objects
  
- #### /{id}

  + ***Purpose:*** Retrieve specific battle with provided {id}
  + ***Return:*** a battle object
 
- #### /unit/{id}

  + ***Purpose:*** Retrieve all battles assiciated with unit that has the provided {id}
  + ***Return:*** an array of battle objects

- #### /force/{id}

  + ***Purpose:*** Retrieve all battles assiciated with the force that has the provided {id}
  + ***Return:*** an array of battle objects

### POST
- #### /create

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
- #### /update

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

- #### /add/d_psychic_powers

  + ***Purpose:***
  + ***Body:***
  
    * token: AUTH_TOKEN

  + ***Return:***

- #### /subtract/d_psychic_powers

  + ***Purpose:***
  + ***Body:***
  
    * 

  + ***Return:***

- #### /add/d_ranged

  + ***Purpose:***
  + ***Body:***
  
    * 

  + ***Return:***

- #### /subtract/d_ranged

  + ***Purpose:***
  + ***Body:***
  
    * 

  + ***Return:***

- #### /add/d_melee

  + ***Purpose:***
  + ***Body:***
  
    * 

  + ***Return:***

- #### /subtract/d_melee

  + ***Purpose:***
  + ***Body:***
  
    * 

  + ***Return:***

- #### /add/agenda_1

  + ***Purpose:***
  + ***Body:***
  
    * 

  + ***Return:***

- #### /subtract/agenda_1

  + ***Purpose:***
  + ***Body:***
  
    * 

  + ***Return:***

- #### /add/agenda_2

  + ***Purpose:***
  + ***Body:***
  
    * 

  + ***Return:***

- #### /subtract/agenda_2

  + ***Purpose:***
  + ***Body:***
  
    * 

  + ***Return:***

- #### /add/agenda_3

  + ***Purpose:***
  + ***Body:***
  
    * 

  + ***Return:***

- #### /subtract/agenda_3

  + ***Purpose:***
  + ***Body:***
  
    * 

  + ***Return:***

### DELETE
- #### /delete
## /factions
## /forces
## /goals
## /information
## /players
## /ranks
## /roles
## /supply_types
## /units
## /victories




///
  + ***Purpose:***
  + ***Body:***
  
    * 

  + ***Return:***

