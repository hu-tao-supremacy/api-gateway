import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { Tag } from '@onepass/entities';
import { ParticipantService } from '@onepass/participant/participant.service';
import { Observable } from 'rxjs';

@Resolver(() => Tag)
export class TagResolver {
    constructor(private readonly participantService: ParticipantService) {}

    @Query(() => [Tag])
    tags(): Observable<Tag[]> {
        return this.participantService.getTags()
    }
   
    @Query(() => Tag)
    tag(
        @Args('id', { type: () => Int }) id: number
    ): Observable<Tag> {
        return this.participantService.getTagById(id)
    }
}
