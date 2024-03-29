import Convex from '../utils/Convex.js'

class Entity {
    // Entities are defined by their center (x, y) and boundary vertices
    constructor(x, y, width, height, color, type, vertices, polygonSides, angle) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = color
        this.type = type
        this.vertices = vertices
        this.polygonSides = polygonSides
        this.angle = angle
        this.collisions = []
        this.associatedEntities = [this]
        this.originalPos = { x, y }

        if (angle === undefined) {
            this.angle = 0
        }

        if (polygonSides !== undefined) {
            this.vertices = Convex.constructPolygon(x, y, width, polygonSides, 0)
        }
    }

    static Types = {
        Player: "player",
        Weapon: "weapon",
        Ball: "ball",
        Goal: "goal",
        Border: "border"
    }

    getCenter() {
        return { x, y }
    }

    getHitbox() {
        return new Convex(this.vertices)
    }

    getGroupedEntities() {
        return this.associatedEntities
    }

    isFriendly(otherEntity) {
        return this.associatedEntities.includes(otherEntity)
    }

    rotate(degrees) {
        this.angle += degrees
    }

    reset() {
        this.x = this.originalPos.x
        this.y = this.originalPos.y
    }

    draw(context) {
        const hitbox = this.getHitbox()
        hitbox.draw(context, this.color)
    }

    resolveGameBorderCollision(gameDimensions) {
        if (this.x - this.width < 1) {
            this.x = this.width
        }
        else if (this.x + this.width > gameDimensions.width) {
            this.x = gameDimensions.width - this.width
        }

        if (this.y - this.height < 1) {
            this.y = this.height
        }
        else if (this.y + this.height > gameDimensions.height) {
            this.y = gameDimensions.height - this.height
        }
    }

    checkCollision(otherEntity) {
        const hitbox = this.getHitbox()
        const otherHitbox = otherEntity.getHitbox()
        const collision = hitbox.getCollision(otherHitbox)
        return collision
    }

    resolveCollision(collision) {
        // moves the entity away from the center of the colliding entity
        const otherEntity = collision.entity
        const dx = this.x - otherEntity.x
        const dy = this.y - otherEntity.y
        const dist = Math.sqrt(dx**2 + dy**2)

        const mvtX = dx * collision.mvtMagnitude / dist
        const mvtY = dy * collision.mvtMagnitude / dist

        this.x += mvtX
        this.y += mvtY
    }

    resolveCollision2(collision) {
        // ------------> SAT static resolution <------------
        // collisions are checked preferentially on left/bottom face first
        // this is just an easy fix for when edge normal is inverted
        const otherEntity = collision.entity
        if (this.x > otherEntity.x) {
            collision.mvtVector.i *= -1
        }
        if (this.y < otherEntity.y) {
            collision.mvtVector.j *= -1
        }

        this.x += collision.mvtVector.i * collision.mvtMagnitude
        this.y += collision.mvtVector.j * collision.mvtMagnitude
    }

    update(vertices) {
        if (vertices !== undefined) {
            this.vertices = vertices
        }
        else if (this.polygonSides !== undefined) {
            this.vertices = Convex.constructPolygon(this.x, this.y, this.width, this.polygonSides, this.angle)
        }
    }

}

export default Entity