

class EntityManager {
    constructor() {
        this.entities = []
    }

    addEntity(entity) {
        const entityGroup = entity.getGroupedEntities()
        entityGroup.forEach(ent => this.entities.push(ent))
    }

    removeEntity(entity) {
        const idx = this.entities.indexOf(entity)
        this.entities.splice(idx)
    }

    update() {
        for (let i = 0; i < this.entities.length; i++) {
            const entity1 = this.entities[i]
            entity1.collisions = [] // reset collisions every frame
            for (let j = i + 1; j < this.entities.length; j++) {
                const entity2 = this.entities[j]
                if (!entity1.isFriendly(entity2) && entity1.checkCollision(entity2)) {
                    entity1.collisions.push(entity2)
                    entity2.collisions.push(entity1)
                }
            }
        }
    }
}

export default EntityManager