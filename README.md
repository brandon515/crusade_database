
<li>
        <p>One</p>
        <ul>
            <li>one</li>
            <li>two</li>
        </ul>
    </li>
    <li>
        <p>Two</p>
        <ol start="3">
            <li>three</li>
            <li>four</li>
        </ol>
  </li>


# Endpoints
## /battles
- ### OBJECT
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
- ### GET
- #### /
+ ***Purpose:*** Retrieves all battles in relation
+ ***Returns:*** An array of battle objects
- #### /:id
***Purpose:*** Retrieves specific battle with provided :id

***Returns:*** a battle object
- #### /unit/:id
Purpose: Retrieves all battles assiciated with unit that has the provided :id
- #### /force/:id
### POST
#### /create
### PUT
#### /update
#### /add/d_psychic_powers
#### /subtract/d_psychic_powers
#### /add/d_ranged
#### /subtract/d_ranged
#### /add/d_melee
#### /subtract/d_melee
#### /add/agenda_1
#### /subtract/agenda_1
#### /add/agenda_2
#### /subtract/agenda_2
#### /add/agenda_3
#### /subtract/agenda_3
### DELETE
#### /delete
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
