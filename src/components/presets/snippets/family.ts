import { Snippet } from "./types";

export const familySnippets: Snippet[] = [
  {
    id: "mom",
    name: "Mom",
    mood: "Family & Friends",
    variants: {
      TypeScript: {
        fileName: "mom.ts",
        code: `while (child.isAway()) {
  mom.ask("did you eat?");
  mom.pray(child);
}

child.comeHome();
mom.say("you look thin");
mom.cook(child.favoriteMeal);`,
      },
      Python: {
        fileName: "mom.py",
        code: `while child.is_away():
    mom.ask("did you eat?")
    mom.pray(child)

child.come_home()
mom.say("you look thin")
mom.cook(child.favorite_meal)`,
      },
      Rust: {
        fileName: "mom.rs",
        code: `fn main() {
    while child.is_away() {
        mom.ask("did you eat?");
        mom.pray(&child);
    }
    child.come_home();
    mom.say("you look thin");
    mom.cook(&child.favorite_meal);
}`,
      },
      Go: {
        fileName: "mom.go",
        code: `func main() {
    for child.IsAway() {
        mom.Ask("did you eat?")
        mom.Pray(child)
    }
    child.ComeHome()
    mom.Say("you look thin")
    mom.Cook(child.FavoriteMeal)
}`,
      },
      Java: {
        fileName: "Mom.java",
        code: `void main() {
    while (child.isAway()) {
        mom.ask("did you eat?");
        mom.pray(child);
    }
    child.comeHome();
    mom.say("you look thin");
    mom.cook(child.favoriteMeal);
}`,
      },
      Swift: {
        fileName: "Mom.swift",
        code: `while child.isAway {
    mom.ask("did you eat?")
    mom.pray(for: child)
}

child.comeHome()
mom.say("you look thin")
mom.cook(child.favoriteMeal)`,
      },
    },
  },
  {
    id: "dad",
    name: "Dad",
    mood: "Family & Friends",
    variants: {
      TypeScript: {
        fileName: "dad.ts",
        code: `while (family.needsAnything()) {
  dad.workOneMoreShift();
  dad.say("I'm not tired");
}

child.graduate();
dad.act("cool about it");
dad.tellEveryoneExcept(child);`,
      },
      Python: {
        fileName: "dad.py",
        code: `while family.needs_anything():
    dad.work_one_more_shift()
    dad.say("I'm not tired")

child.graduate()
dad.act("cool about it")
dad.tell_everyone_except(child)`,
      },
      Rust: {
        fileName: "dad.rs",
        code: `fn main() {
    while family.needs_anything() {
        dad.work_one_more_shift();
        dad.say("I'm not tired");
    }
    child.graduate();
    dad.act("cool about it");
    dad.tell_everyone_except(&child);
}`,
      },
      Go: {
        fileName: "dad.go",
        code: `func main() {
    for family.NeedsAnything() {
        dad.WorkOneMoreShift()
        dad.Say("I'm not tired")
    }
    child.Graduate()
    dad.Act("cool about it")
    dad.TellEveryoneExcept(child)
}`,
      },
      Java: {
        fileName: "Dad.java",
        code: `void main() {
    while (family.needsAnything()) {
        dad.workOneMoreShift();
        dad.say("I'm not tired");
    }
    child.graduate();
    dad.act("cool about it");
    dad.tellEveryoneExcept(child);
}`,
      },
      Swift: {
        fileName: "Dad.swift",
        code: `while family.needsAnything {
    dad.workOneMoreShift()
    dad.say("I'm not tired")
}

child.graduate()
dad.act("cool about it")
dad.tellEveryone(except: child)`,
      },
    },
  },
  {
    id: "best-friend",
    name: "Best Friend",
    mood: "Family & Friends",
    variants: {
      TypeScript: {
        fileName: "best-friend.ts",
        code: `const lastCall = years(5).ago;
bestFriend.answer();
bestFriend.continueFrom(lastCall);

if (you.needHelp()) {
  bestFriend.showUp();
  bestFriend.skipTheQuestions();
}`,
      },
      Python: {
        fileName: "best_friend.py",
        code: `last_call = years(5).ago
best_friend.answer()
best_friend.continue_from(last_call)

if you.need_help():
    best_friend.show_up()
    best_friend.skip_the_questions()`,
      },
      Rust: {
        fileName: "best_friend.rs",
        code: `fn main() {
    let last_call = years(5).ago();
    best_friend.answer();
    best_friend.continue_from(last_call);
    if you.need_help() {
        best_friend.show_up();
        best_friend.skip_the_questions();
    }
}`,
      },
      Go: {
        fileName: "best_friend.go",
        code: `func main() {
    lastCall := Years(5).Ago()
    bestFriend.Answer()
    bestFriend.ContinueFrom(lastCall)
    if you.NeedHelp() {
        bestFriend.ShowUp()
        bestFriend.SkipTheQuestions()
    }
}`,
      },
      Java: {
        fileName: "BestFriend.java",
        code: `void main() {
    var lastCall = years(5).ago();
    bestFriend.answer();
    bestFriend.continueFrom(lastCall);
    if (you.needHelp()) {
        bestFriend.showUp();
        bestFriend.skipTheQuestions();
    }
}`,
      },
      Swift: {
        fileName: "BestFriend.swift",
        code: `let lastCall = years(5).ago
bestFriend.answer()
bestFriend.continue(from: lastCall)

if you.needHelp {
    bestFriend.showUp()
    bestFriend.skipTheQuestions()
}`,
      },
    },
  },
  {
    id: "siblings",
    name: "Siblings",
    mood: "Family & Friends",
    variants: {
      TypeScript: {
        fileName: "siblings.ts",
        code: `while (stillGrowingUp()) {
  sibling.fightWith(you);
  sibling.borrow(yourHoodie);
  sibling.blame(you);
}

outsider.insult(you);
sibling.defend(you);`,
      },
      Python: {
        fileName: "siblings.py",
        code: `while still_growing_up():
    sibling.fight_with(you)
    sibling.borrow(your_hoodie)
    sibling.blame(you)

outsider.insult(you)
sibling.defend(you)`,
      },
      Rust: {
        fileName: "siblings.rs",
        code: `fn main() {
    while still_growing_up() {
        sibling.fight_with(&you);
        sibling.borrow(&mut your_hoodie);
        sibling.blame(&you);
    }
    outsider.insult(&you);
    sibling.defend(&you);
}`,
      },
      Go: {
        fileName: "siblings.go",
        code: `func main() {
    for stillGrowingUp() {
        sibling.FightWith(you)
        sibling.Borrow(yourHoodie)
        sibling.Blame(you)
    }
    outsider.Insult(you)
    sibling.Defend(you)
}`,
      },
      Java: {
        fileName: "Siblings.java",
        code: `void main() {
    while (stillGrowingUp()) {
        sibling.fightWith(you);
        sibling.borrow(yourHoodie);
        sibling.blame(you);
    }
    outsider.insult(you);
    sibling.defend(you);
}`,
      },
      Swift: {
        fileName: "Siblings.swift",
        code: `while stillGrowingUp() {
    sibling.fight(with: you)
    sibling.borrow(yourHoodie)
    sibling.blame(you)
}

outsider.insult(you)
sibling.defend(you)`,
      },
    },
  },
  {
    id: "hometown",
    name: "Hometown",
    mood: "Family & Friends",
    variants: {
      TypeScript: {
        fileName: "hometown.ts",
        code: `for (const city of newCities) {
  you.compare(city, hometown);
  you.miss(hometown);
}

you.visit(hometown);
you.age = 10;
oldStreets.remember(you);`,
      },
      Python: {
        fileName: "hometown.py",
        code: `for city in new_cities:
    you.compare(city, hometown)
    you.miss(hometown)

you.visit(hometown)
you.age = 10
old_streets.remember(you)`,
      },
      Rust: {
        fileName: "hometown.rs",
        code: `fn main() {
    for city in &new_cities {
        you.compare(city, &hometown);
        you.miss(&hometown);
    }
    you.visit(&hometown);
    you.age = 10;
    old_streets.remember(&you);
}`,
      },
      Go: {
        fileName: "hometown.go",
        code: `func main() {
    for _, city := range newCities {
        you.Compare(city, hometown)
        you.Miss(hometown)
    }
    you.Visit(hometown)
    you.Age = 10
    oldStreets.Remember(you)
}`,
      },
      Java: {
        fileName: "Hometown.java",
        code: `void main() {
    for (var city : newCities) {
        you.compare(city, hometown);
        you.miss(hometown);
    }
    you.visit(hometown);
    you.age = 10;
    oldStreets.remember(you);
}`,
      },
      Swift: {
        fileName: "Hometown.swift",
        code: `for city in newCities {
    you.compare(city, to: hometown)
    you.miss(hometown)
}

you.visit(hometown)
you.age = 10
oldStreets.remember(you)`,
      },
    },
  },
  {
    id: "grandmas-kitchen",
    name: "Grandma's Kitchen",
    mood: "Family & Friends",
    variants: {
      TypeScript: {
        fileName: "grandmas-kitchen.ts",
        code: `grandma.wake(beforeSunrise);
grandma.cook(withoutARecipe);
const plate = grandma.serve(you);

while (you.say("I'm full")) {
  plate.add(oneMoreSpoon);
  grandma.smile();
}`,
      },
      Python: {
        fileName: "grandmas_kitchen.py",
        code: `grandma.wake(before_sunrise)
grandma.cook(without_a_recipe)
plate = grandma.serve(you)

while you.say("I'm full"):
    plate.add(one_more_spoon)
    grandma.smile()`,
      },
      Rust: {
        fileName: "grandmas_kitchen.rs",
        code: `fn main() {
    grandma.wake(before_sunrise);
    grandma.cook(without_a_recipe);
    let mut plate = grandma.serve(&you);
    while you.say("I'm full") {
        plate.add(one_more_spoon);
        grandma.smile();
    }
}`,
      },
      Go: {
        fileName: "grandmas_kitchen.go",
        code: `func main() {
    grandma.Wake(beforeSunrise)
    grandma.Cook(withoutARecipe)
    plate := grandma.Serve(you)
    for you.Say("I'm full") {
        plate.Add(oneMoreSpoon)
        grandma.Smile()
    }
}`,
      },
      Java: {
        fileName: "GrandmasKitchen.java",
        code: `void main() {
    grandma.wake(beforeSunrise);
    grandma.cook(withoutARecipe);
    var plate = grandma.serve(you);
    while (you.say("I'm full")) {
        plate.add(oneMoreSpoon);
        grandma.smile();
    }
}`,
      },
      Swift: {
        fileName: "GrandmasKitchen.swift",
        code: `grandma.wake(before: .sunrise)
grandma.cook(recipe: nil)
let plate = grandma.serve(you)

while you.say("I'm full") {
    plate.add(oneMoreSpoon)
    grandma.smile()
}`,
      },
    },
  },
  {
    id: "grandpas-stories",
    name: "Grandpa's Stories",
    mood: "Family & Friends",
    variants: {
      TypeScript: {
        fileName: "grandpas-stories.ts",
        code: `for (const visit of childhood) {
  grandpa.tell(sameOldStory);
  you.pretendToListen();
}

grandpa.rest();
you.tell(yourKids, sameOldStory);
you.knowEveryWord();`,
      },
      Python: {
        fileName: "grandpas_stories.py",
        code: `for visit in childhood:
    grandpa.tell(same_old_story)
    you.pretend_to_listen()

grandpa.rest()
you.tell(your_kids, same_old_story)
you.know_every_word()`,
      },
      Rust: {
        fileName: "grandpas_stories.rs",
        code: `fn main() {
    for _ in &childhood {
        grandpa.tell(&same_old_story);
        you.pretend_to_listen();
    }
    grandpa.rest();
    you.tell(&your_kids, &same_old_story);
    you.know_every_word();
}`,
      },
      Go: {
        fileName: "grandpas_stories.go",
        code: `func main() {
    for range childhood {
        grandpa.Tell(sameOldStory)
        you.PretendToListen()
    }
    grandpa.Rest()
    you.Tell(yourKids, sameOldStory)
    you.KnowEveryWord()
}`,
      },
      Java: {
        fileName: "GrandpasStories.java",
        code: `void main() {
    for (var visit : childhood) {
        grandpa.tell(sameOldStory);
        you.pretendToListen();
    }
    grandpa.rest();
    you.tell(yourKids, sameOldStory);
    you.knowEveryWord();
}`,
      },
      Swift: {
        fileName: "GrandpasStories.swift",
        code: `for _ in childhood {
    grandpa.tell(sameOldStory)
    you.pretendToListen()
}

grandpa.rest()
you.tell(yourKids, sameOldStory)
you.knowEveryWord()`,
      },
    },
  },
  {
    id: "first-day-of-school",
    name: "First Day of School",
    mood: "Family & Friends",
    variants: {
      TypeScript: {
        fileName: "first-day-of-school.ts",
        code: `parent.pack(newBag);
parent.fix(collar);
parent.say("you'll be fine");

if (child.looksBack()) {
  parent.wave(bothHands);
  parent.cryInTheCar();
}`,
      },
      Python: {
        fileName: "first_day_of_school.py",
        code: `parent.pack(new_bag)
parent.fix(collar)
parent.say("you'll be fine")

if child.looks_back():
    parent.wave(both_hands)
    parent.cry_in_the_car()`,
      },
      Rust: {
        fileName: "first_day_of_school.rs",
        code: `fn main() {
    parent.pack(new_bag);
    parent.fix(&mut collar);
    parent.say("you'll be fine");
    if child.looks_back() {
        parent.wave(both_hands);
        parent.cry_in_the_car();
    }
}`,
      },
      Go: {
        fileName: "first_day_of_school.go",
        code: `func main() {
    parent.Pack(newBag)
    parent.Fix(collar)
    parent.Say("you'll be fine")
    if child.LooksBack() {
        parent.Wave(bothHands)
        parent.CryInTheCar()
    }
}`,
      },
      Java: {
        fileName: "FirstDayOfSchool.java",
        code: `void main() {
    parent.pack(newBag);
    parent.fix(collar);
    parent.say("you'll be fine");
    if (child.looksBack()) {
        parent.wave(bothHands);
        parent.cryInTheCar();
    }
}`,
      },
      Swift: {
        fileName: "FirstDayOfSchool.swift",
        code: `parent.pack(newBag)
parent.fix(collar)
parent.say("you'll be fine")

if child.looksBack {
    parent.wave(.bothHands)
    parent.cryInTheCar()
}`,
      },
    },
  },
  {
    id: "packed-lunch",
    name: "Packed Lunch",
    mood: "Family & Friends",
    variants: {
      TypeScript: {
        fileName: "packed-lunch.ts",
        code: `const lunch = new LunchBox();
lunch.add(sandwich);
lunch.add(note("proud of you"));

if (friends.see(lunch.note)) {
  you.hide(lunch.note);
  you.keep(lunch.note, forever);
}`,
      },
      Python: {
        fileName: "packed_lunch.py",
        code: `lunch = LunchBox()
lunch.add(sandwich)
lunch.add(note("proud of you"))

if friends.see(lunch.note):
    you.hide(lunch.note)
    you.keep(lunch.note, forever)`,
      },
      Rust: {
        fileName: "packed_lunch.rs",
        code: `fn main() {
    let mut lunch = LunchBox::new();
    lunch.add(sandwich);
    lunch.add(note("proud of you"));
    if friends.see(&lunch.note) {
        you.hide(&lunch.note);
        you.keep(lunch.note, forever);
    }
}`,
      },
      Go: {
        fileName: "packed_lunch.go",
        code: `func main() {
    lunch := NewLunchBox()
    lunch.Add(sandwich)
    lunch.Add(Note("proud of you"))
    if friends.See(lunch.Note) {
        you.Hide(lunch.Note)
        you.Keep(lunch.Note, forever)
    }
}`,
      },
      Java: {
        fileName: "PackedLunch.java",
        code: `void main() {
    var lunch = new LunchBox();
    lunch.add(sandwich);
    lunch.add(note("proud of you"));
    if (friends.see(lunch.note)) {
        you.hide(lunch.note);
        you.keep(lunch.note, forever);
    }
}`,
      },
      Swift: {
        fileName: "PackedLunch.swift",
        code: `var lunch = LunchBox()
lunch.add(sandwich)
lunch.add(Note("proud of you"))

if friends.see(lunch.note) {
    you.hide(lunch.note)
    you.keep(lunch.note, for: .ever)
}`,
      },
    },
  },
  {
    id: "road-trip",
    name: "Road Trip",
    mood: "Family & Friends",
    variants: {
      TypeScript: {
        fileName: "road-trip.ts",
        code: `const car = family.packInto(oneCar);
dad.refuse(gps);
mom.play(sameFiveSongs);

while (!car.arrived()) {
  kids.ask("are we there yet?");
  dad.say("ten more minutes");
}`,
      },
      Python: {
        fileName: "road_trip.py",
        code: `car = family.pack_into(one_car)
dad.refuse(gps)
mom.play(same_five_songs)

while not car.arrived():
    kids.ask("are we there yet?")
    dad.say("ten more minutes")`,
      },
      Rust: {
        fileName: "road_trip.rs",
        code: `fn main() {
    let car = family.pack_into(one_car);
    dad.refuse(gps);
    mom.play(&same_five_songs);
    while !car.arrived() {
        kids.ask("are we there yet?");
        dad.say("ten more minutes");
    }
}`,
      },
      Go: {
        fileName: "road_trip.go",
        code: `func main() {
    car := family.PackInto(oneCar)
    dad.Refuse(gps)
    mom.Play(sameFiveSongs)
    for !car.Arrived() {
        kids.Ask("are we there yet?")
        dad.Say("ten more minutes")
    }
}`,
      },
      Java: {
        fileName: "RoadTrip.java",
        code: `void main() {
    var car = family.packInto(oneCar);
    dad.refuse(gps);
    mom.play(sameFiveSongs);
    while (!car.arrived()) {
        kids.ask("are we there yet?");
        dad.say("ten more minutes");
    }
}`,
      },
      Swift: {
        fileName: "RoadTrip.swift",
        code: `let car = family.pack(into: oneCar)
dad.refuse(gps)
mom.play(sameFiveSongs)

while !car.arrived {
    kids.ask("are we there yet?")
    dad.say("ten more minutes")
}`,
      },
    },
  },
  {
    id: "little-brother",
    name: "Little Brother",
    mood: "Family & Friends",
    variants: {
      TypeScript: {
        fileName: "little-brother.ts",
        code: `littleBrother.copy(everythingYouDo);
littleBrother.eat(yourSnacks);
littleBrother.tell(mom, yourSecret);

if (you.leave(home)) {
  littleBrother.take(yourRoom);
  littleBrother.missYou(quietly);
}`,
      },
      Python: {
        fileName: "little_brother.py",
        code: `little_brother.copy(everything_you_do)
little_brother.eat(your_snacks)
little_brother.tell(mom, your_secret)

if you.leave(home):
    little_brother.take(your_room)
    little_brother.miss_you(quietly)`,
      },
      Rust: {
        fileName: "little_brother.rs",
        code: `fn main() {
    little_brother.copy(&everything_you_do);
    little_brother.eat(your_snacks);
    little_brother.tell(&mom, your_secret);
    if you.leave(&home) {
        little_brother.take(your_room);
        little_brother.miss_you(quietly);
    }
}`,
      },
      Go: {
        fileName: "little_brother.go",
        code: `func main() {
    littleBrother.Copy(everythingYouDo)
    littleBrother.Eat(yourSnacks)
    littleBrother.Tell(mom, yourSecret)
    if you.Leave(home) {
        littleBrother.Take(yourRoom)
        littleBrother.MissYou(quietly)
    }
}`,
      },
      Java: {
        fileName: "LittleBrother.java",
        code: `void main() {
    littleBrother.copy(everythingYouDo);
    littleBrother.eat(yourSnacks);
    littleBrother.tell(mom, yourSecret);
    if (you.leave(home)) {
        littleBrother.take(yourRoom);
        littleBrother.missYou(quietly);
    }
}`,
      },
      Swift: {
        fileName: "LittleBrother.swift",
        code: `littleBrother.copy(everythingYouDo)
littleBrother.eat(yourSnacks)
littleBrother.tell(mom, yourSecret)

if you.leave(home) {
    littleBrother.take(yourRoom)
    littleBrother.missYou(.quietly)
}`,
      },
    },
  },
  {
    id: "big-sister",
    name: "Big Sister",
    mood: "Family & Friends",
    variants: {
      TypeScript: {
        fileName: "big-sister.ts",
        code: `for (const mistake of yourTeens) {
  bigSister.make(mistake);
  bigSister.warn(you);
}

bigSister.tease(you);
bigSister.steal(yourFries);
bigSister.coverFor(you);`,
      },
      Python: {
        fileName: "big_sister.py",
        code: `for mistake in your_teens:
    big_sister.make(mistake)
    big_sister.warn(you)

big_sister.tease(you)
big_sister.steal(your_fries)
big_sister.cover_for(you)`,
      },
      Rust: {
        fileName: "big_sister.rs",
        code: `fn main() {
    for mistake in &your_teens {
        big_sister.make(mistake);
        big_sister.warn(&you);
    }
    big_sister.tease(&you);
    big_sister.steal(&mut your_fries);
    big_sister.cover_for(&you);
}`,
      },
      Go: {
        fileName: "big_sister.go",
        code: `func main() {
    for _, mistake := range yourTeens {
        bigSister.Make(mistake)
        bigSister.Warn(you)
    }
    bigSister.Tease(you)
    bigSister.Steal(yourFries)
    bigSister.CoverFor(you)
}`,
      },
      Java: {
        fileName: "BigSister.java",
        code: `void main() {
    for (var mistake : yourTeens) {
        bigSister.make(mistake);
        bigSister.warn(you);
    }
    bigSister.tease(you);
    bigSister.steal(yourFries);
    bigSister.coverFor(you);
}`,
      },
      Swift: {
        fileName: "BigSister.swift",
        code: `for mistake in yourTeens {
    bigSister.make(mistake)
    bigSister.warn(you)
}

bigSister.tease(you)
bigSister.steal(yourFries)
bigSister.cover(for: you)`,
      },
    },
  },
  {
    id: "roommates",
    name: "Roommates",
    mood: "Family & Friends",
    variants: {
      TypeScript: {
        fileName: "roommates.ts",
        code: `roommate.eat(yourLeftovers);
roommate.leave(dishesInSink);
roommate.borrow(charger, forever);

if (you.haveABadDay()) {
  roommate.order(pizza);
  roommate.pick(yourFavoriteMovie);
}`,
      },
      Python: {
        fileName: "roommates.py",
        code: `roommate.eat(your_leftovers)
roommate.leave(dishes_in_sink)
roommate.borrow(charger, forever)

if you.have_a_bad_day():
    roommate.order(pizza)
    roommate.pick(your_favorite_movie)`,
      },
      Rust: {
        fileName: "roommates.rs",
        code: `fn main() {
    roommate.eat(your_leftovers);
    roommate.leave(dishes_in_sink);
    roommate.borrow(&charger, forever);
    if you.have_a_bad_day() {
        roommate.order(pizza);
        roommate.pick(&your_favorite_movie);
    }
}`,
      },
      Go: {
        fileName: "roommates.go",
        code: `func main() {
    roommate.Eat(yourLeftovers)
    roommate.Leave(dishesInSink)
    roommate.Borrow(charger, forever)
    if you.HaveABadDay() {
        roommate.Order(pizza)
        roommate.Pick(yourFavoriteMovie)
    }
}`,
      },
      Java: {
        fileName: "Roommates.java",
        code: `void main() {
    roommate.eat(yourLeftovers);
    roommate.leave(dishesInSink);
    roommate.borrow(charger, forever);
    if (you.haveABadDay()) {
        roommate.order(pizza);
        roommate.pick(yourFavoriteMovie);
    }
}`,
      },
      Swift: {
        fileName: "Roommates.swift",
        code: `roommate.eat(yourLeftovers)
roommate.leave(dishesInSink)
roommate.borrow(charger, for: .ever)

if you.haveABadDay {
    roommate.order(pizza)
    roommate.pick(yourFavoriteMovie)
}`,
      },
    },
  },
  {
    id: "childhood-friend",
    name: "Childhood Friend",
    mood: "Family & Friends",
    variants: {
      TypeScript: {
        fileName: "childhood-friend.ts",
        code: `for (const summer of summers) {
  friend.race(you, toTheCorner);
  friend.share(halfOfEverything);
}

years.pass(20);
friend.call(you);
you.laughUntilYouCry();`,
      },
      Python: {
        fileName: "childhood_friend.py",
        code: `for summer in summers:
    friend.race(you, to_the_corner)
    friend.share(half_of_everything)

years.pass_(20)
friend.call(you)
you.laugh_until_you_cry()`,
      },
      Rust: {
        fileName: "childhood_friend.rs",
        code: `fn main() {
    for _ in &summers {
        friend.race(&you, to_the_corner);
        friend.share(half_of_everything);
    }
    years.pass(20);
    friend.call(&you);
    you.laugh_until_you_cry();
}`,
      },
      Go: {
        fileName: "childhood_friend.go",
        code: `func main() {
    for range summers {
        friend.Race(you, toTheCorner)
        friend.Share(halfOfEverything)
    }
    years.Pass(20)
    friend.Call(you)
    you.LaughUntilYouCry()
}`,
      },
      Java: {
        fileName: "ChildhoodFriend.java",
        code: `void main() {
    for (var summer : summers) {
        friend.race(you, toTheCorner);
        friend.share(halfOfEverything);
    }
    years.pass(20);
    friend.call(you);
    you.laughUntilYouCry();
}`,
      },
      Swift: {
        fileName: "ChildhoodFriend.swift",
        code: `for _ in summers {
    friend.race(you, to: .theCorner)
    friend.share(halfOfEverything)
}

years.pass(20)
friend.call(you)
you.laughUntilYouCry()`,
      },
    },
  },
  {
    id: "group-chat",
    name: "Group Chat",
    mood: "Family & Friends",
    variants: {
      TypeScript: {
        fileName: "group-chat.ts",
        code: `const chat = new GroupChat(oldFriends);
chat.send("we should meet up!");
everyone.reply("yes!!");

while (!plan.isMade()) {
  chat.send(memes);
  chat.say("next week for sure");
}`,
      },
      Python: {
        fileName: "group_chat.py",
        code: `chat = GroupChat(old_friends)
chat.send("we should meet up!")
everyone.reply("yes!!")

while not plan.is_made():
    chat.send(memes)
    chat.say("next week for sure")`,
      },
      Rust: {
        fileName: "group_chat.rs",
        code: `fn main() {
    let mut chat = GroupChat::new(&old_friends);
    chat.send("we should meet up!");
    everyone.reply("yes!!");
    while !plan.is_made() {
        chat.send(memes);
        chat.say("next week for sure");
    }
}`,
      },
      Go: {
        fileName: "group_chat.go",
        code: `func main() {
    chat := NewGroupChat(oldFriends)
    chat.Send("we should meet up!")
    everyone.Reply("yes!!")
    for !plan.IsMade() {
        chat.Send(memes)
        chat.Say("next week for sure")
    }
}`,
      },
      Java: {
        fileName: "GroupChat.java",
        code: `void main() {
    var chat = new GroupChat(oldFriends);
    chat.send("we should meet up!");
    everyone.reply("yes!!");
    while (!plan.isMade()) {
        chat.send(memes);
        chat.say("next week for sure");
    }
}`,
      },
      Swift: {
        fileName: "GroupChat.swift",
        code: `let chat = GroupChat(oldFriends)
chat.send("we should meet up!")
everyone.reply("yes!!")

while !plan.isMade {
    chat.send(memes)
    chat.say("next week for sure")
}`,
      },
    },
  },
  {
    id: "pet-dog",
    name: "Pet Dog",
    mood: "Family & Friends",
    variants: {
      TypeScript: {
        fileName: "pet-dog.ts",
        code: `you.leave(forFiveMinutes);
dog.wait(byTheDoor);
dog.sigh();

if (you.comeBack()) {
  dog.lose(itsMind);
  dog.act("like it's been years");
}`,
      },
      Python: {
        fileName: "pet_dog.py",
        code: `you.leave(for_five_minutes)
dog.wait(by_the_door)
dog.sigh()

if you.come_back():
    dog.lose(its_mind)
    dog.act("like it's been years")`,
      },
      Rust: {
        fileName: "pet_dog.rs",
        code: `fn main() {
    you.leave(for_five_minutes);
    dog.wait(by_the_door);
    dog.sigh();
    if you.come_back() {
        dog.lose(its_mind);
        dog.act("like it's been years");
    }
}`,
      },
      Go: {
        fileName: "pet_dog.go",
        code: `func main() {
    you.Leave(forFiveMinutes)
    dog.Wait(byTheDoor)
    dog.Sigh()
    if you.ComeBack() {
        dog.Lose(itsMind)
        dog.Act("like it's been years")
    }
}`,
      },
      Java: {
        fileName: "PetDog.java",
        code: `void main() {
    you.leave(forFiveMinutes);
    dog.wait(byTheDoor);
    dog.sigh();
    if (you.comeBack()) {
        dog.lose(itsMind);
        dog.act("like it's been years");
    }
}`,
      },
      Swift: {
        fileName: "PetDog.swift",
        code: `you.leave(for: .minutes(5))
dog.wait(by: .door)
dog.sigh()

if you.comeBack() {
    dog.lose(itsMind)
    dog.act("like it's been years")
}`,
      },
    },
  },
  {
    id: "new-baby",
    name: "New Baby",
    mood: "Family & Friends",
    variants: {
      TypeScript: {
        fileName: "new-baby.ts",
        code: `const baby = family.welcome(newBaby);
parents.sleep = 0;
grandparents.visit(daily);

if (baby.holds(yourFinger)) {
  you.forget(everythingElse);
  you.promise(baby, everything);
}`,
      },
      Python: {
        fileName: "new_baby.py",
        code: `baby = family.welcome(new_baby)
parents.sleep = 0
grandparents.visit(daily)

if baby.holds(your_finger):
    you.forget(everything_else)
    you.promise(baby, everything)`,
      },
      Rust: {
        fileName: "new_baby.rs",
        code: `fn main() {
    let baby = family.welcome(new_baby);
    parents.sleep = 0;
    grandparents.visit(daily);
    if baby.holds(&your_finger) {
        you.forget(everything_else);
        you.promise(&baby, everything);
    }
}`,
      },
      Go: {
        fileName: "new_baby.go",
        code: `func main() {
    baby := family.Welcome(newBaby)
    parents.Sleep = 0
    grandparents.Visit(daily)
    if baby.Holds(yourFinger) {
        you.Forget(everythingElse)
        you.Promise(baby, everything)
    }
}`,
      },
      Java: {
        fileName: "NewBaby.java",
        code: `void main() {
    var baby = family.welcome(newBaby);
    parents.sleep = 0;
    grandparents.visit(daily);
    if (baby.holds(yourFinger)) {
        you.forget(everythingElse);
        you.promise(baby, everything);
    }
}`,
      },
      Swift: {
        fileName: "NewBaby.swift",
        code: `let baby = family.welcome(newBaby)
parents.sleep = 0
grandparents.visit(.daily)

if baby.holds(yourFinger) {
    you.forget(everythingElse)
    you.promise(baby, everything)
}`,
      },
    },
  },
  {
    id: "parents-getting-older",
    name: "Parents Getting Older",
    mood: "Family & Friends",
    variants: {
      TypeScript: {
        fileName: "parents-getting-older.ts",
        code: `for (const year of theseYears) {
  dad.walk(slower);
  mom.ask(sameQuestion, again);
}

you.callHome(moreOften);
you.answer(sameQuestion, patiently);
you.hold(theirHands, longer);`,
      },
      Python: {
        fileName: "parents_getting_older.py",
        code: `for year in these_years:
    dad.walk(slower)
    mom.ask(same_question, again)

you.call_home(more_often)
you.answer(same_question, patiently)
you.hold(their_hands, longer)`,
      },
      Rust: {
        fileName: "parents_getting_older.rs",
        code: `fn main() {
    for _ in &these_years {
        dad.walk(slower);
        mom.ask(&same_question, again);
    }
    you.call_home(more_often);
    you.answer(&same_question, patiently);
    you.hold(&their_hands, longer);
}`,
      },
      Go: {
        fileName: "parents_getting_older.go",
        code: `func main() {
    for range theseYears {
        dad.Walk(slower)
        mom.Ask(sameQuestion, again)
    }
    you.CallHome(moreOften)
    you.Answer(sameQuestion, patiently)
    you.Hold(theirHands, longer)
}`,
      },
      Java: {
        fileName: "ParentsGettingOlder.java",
        code: `void main() {
    for (var year : theseYears) {
        dad.walk(slower);
        mom.ask(sameQuestion, again);
    }
    you.callHome(moreOften);
    you.answer(sameQuestion, patiently);
    you.hold(theirHands, longer);
}`,
      },
      Swift: {
        fileName: "ParentsGettingOlder.swift",
        code: `for _ in theseYears {
    dad.walk(.slower)
    mom.ask(sameQuestion, again: true)
}

you.callHome(.moreOften)
you.answer(sameQuestion, .patiently)
you.hold(theirHands, .longer)`,
      },
    },
  },
  {
    id: "family-dinner",
    name: "Family Dinner",
    mood: "Family & Friends",
    variants: {
      TypeScript: {
        fileName: "family-dinner.ts",
        code: `table.add(extraChairs);
everyone.arrive(late);
mom.cook(forTwiceAsMany);

while (table.isFull()) {
  everyone.talk(atOnce);
  nobody.check(phones);
}`,
      },
      Python: {
        fileName: "family_dinner.py",
        code: `table.add(extra_chairs)
everyone.arrive(late)
mom.cook(for_twice_as_many)

while table.is_full():
    everyone.talk(at_once)
    nobody.check(phones)`,
      },
      Rust: {
        fileName: "family_dinner.rs",
        code: `fn main() {
    table.add(extra_chairs);
    everyone.arrive(late);
    mom.cook(for_twice_as_many);
    while table.is_full() {
        everyone.talk(at_once);
        nobody.check(&phones);
    }
}`,
      },
      Go: {
        fileName: "family_dinner.go",
        code: `func main() {
    table.Add(extraChairs)
    everyone.Arrive(late)
    mom.Cook(forTwiceAsMany)
    for table.IsFull() {
        everyone.Talk(atOnce)
        nobody.Check(phones)
    }
}`,
      },
      Java: {
        fileName: "FamilyDinner.java",
        code: `void main() {
    table.add(extraChairs);
    everyone.arrive(late);
    mom.cook(forTwiceAsMany);
    while (table.isFull()) {
        everyone.talk(atOnce);
        nobody.check(phones);
    }
}`,
      },
      Swift: {
        fileName: "FamilyDinner.swift",
        code: `table.add(extraChairs)
everyone.arrive(.late)
mom.cook(for: .twiceAsMany)

while table.isFull {
    everyone.talk(.atOnce)
    nobody.check(phones)
}`,
      },
    },
  },
];
