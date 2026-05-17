-- =============================================================================
-- Seed data for Ember app
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Feature flags
-- ---------------------------------------------------------------------------

INSERT INTO feature_flags (key, value, description) VALUES
  ('ai_personalization', 'true'::jsonb, 'Enable AI-powered prompt personalization via Claude'),
  ('explicit_content', 'true'::jsonb, 'Enable explicit content tier (requires age verification and consent)')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- ---------------------------------------------------------------------------
-- Categories
-- ---------------------------------------------------------------------------

INSERT INTO categories (id, slug, name, description, sort_order, icon, active, relationship_structures) VALUES
  ('11111111-0000-0000-0000-000000000001', 'connection',      'Connection',      'Deepen your emotional bond',                    1, '❤️',  true, NULL),
  ('11111111-0000-0000-0000-000000000002', 'curiosity',       'Curiosity',       'Explore each other''s inner world',             2, '🔍',  true, NULL),
  ('11111111-0000-0000-0000-000000000003', 'playful',         'Playful',         'Lighthearted fun and laughter',                 3, '🎉',  true, NULL),
  ('11111111-0000-0000-0000-000000000004', 'touch',           'Touch',           'Mindful physical connection',                   4, '🤝',  true, NULL),
  ('11111111-0000-0000-0000-000000000005', 'fantasy',         'Fantasy',         'Explore imagination and desires',               5, '✨',  true, NULL),
  ('11111111-0000-0000-0000-000000000006', 'adventure',       'Adventure',       'Try something new together',                    6, '🗺️', true, NULL),
  ('11111111-0000-0000-0000-000000000007', 'lifestyle',       'Lifestyle',       'For ethically non-monogamous groups',           7, '🌈',  true, ARRAY['open','swinger','polyamorous','ENM','thruple','quad','constellation','exploring']),
  ('11111111-0000-0000-0000-000000000008', 'group-dynamics',  'Group Dynamics',  'For groups of three or more',                   8, '👥',  true, NULL);

-- ---------------------------------------------------------------------------
-- Prompts — Connection (mild × 20)
-- REPLACE BEFORE LAUNCH — content team will populate via CMS
-- ---------------------------------------------------------------------------

INSERT INTO prompts (id, category_id, tier, body, min_group_size, max_group_size, relationship_structures, published) VALUES
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000001', 'mild', 'Tell {name1} one thing you noticed about {possessive2} energy today.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000001', 'mild', 'Share a memory of the moment you realized you truly trusted {name2}.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000001', 'mild', 'What is one small thing {name2} does that makes you feel cared for?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000001', 'mild', 'Describe a moment when {name1} made you feel truly seen.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000001', 'mild', 'What song reminds you of {name2} and why?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000001', 'mild', 'Tell {name1} about a time {subject2} showed up for you when you needed it most.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000001', 'mild', 'What is one quality in {name2} that you wish you had more of yourself?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000001', 'mild', 'Describe the first time you felt butterflies around {name1}.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000001', 'mild', 'What does {possessive2} laugh do to your mood?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000001', 'mild', 'Name a shared memory that still makes you smile when it comes to mind.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000001', 'mild', 'What is something {name2} taught you without even trying?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000001', 'mild', 'How has {name1} changed you for the better since you met?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000001', 'mild', 'What is one way you want to show {name2} more appreciation this week?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000001', 'mild', 'Tell {name1} about a moment recently when {subject2} made you proud.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000001', 'mild', 'What is {possessive1} favorite thing about how {name2} greets you when you come home?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000001', 'mild', 'Describe {name2} in three words you have never said out loud before.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000001', 'mild', 'What is a hope for your relationship that you have never fully voiced?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000001', 'mild', 'When did you last feel truly connected to {name1}, and what was happening?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000001', 'mild', 'What small gesture from {name2} has the biggest impact on your day?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000001', 'mild', 'Tell {name1} one thing you love about the life you are building together.', 2, 6, '{}', true);

-- ---------------------------------------------------------------------------
-- Connection — spicy × 20
-- REPLACE BEFORE LAUNCH — content team will populate via CMS
-- ---------------------------------------------------------------------------

INSERT INTO prompts (id, category_id, tier, body, min_group_size, max_group_size, relationship_structures, published) VALUES
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000001', 'spicy', 'What is one unspoken need you have been too shy to ask {name2} for?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000001', 'spicy', 'Tell {name1} about a moment you felt emotionally vulnerable and chose to hide it.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000001', 'spicy', 'What is a fear about your relationship you have never fully admitted?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000001', 'spicy', 'Describe a moment when you felt jealous of something {name2} had, and why.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000001', 'spicy', 'What is something {name1} has done that you forgave but never fully discussed?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000001', 'spicy', 'When do you feel most disconnected from {name2}, and what triggers it?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000001', 'spicy', 'What is one thing you wish {name1} understood about how you receive love?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000001', 'spicy', 'Tell {name2} about a moment you doubted whether you were enough for {subject1}.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000001', 'spicy', 'What is a recurring argument pattern you notice in yourself that you want to change?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000001', 'spicy', 'Describe the version of your relationship you dream about five years from now.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000001', 'spicy', 'What is something {name2} does that unknowingly makes you feel unheard?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000001', 'spicy', 'Tell {name1} about a time you chose your pride over your connection.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000001', 'spicy', 'What is one boundary you need to renegotiate with {name2} right now?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000001', 'spicy', 'How do you feel when {name1} is affectionate with you in public?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000001', 'spicy', 'What is something {possessive2} past has shaped about how {subject2} loves you today?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000001', 'spicy', 'Tell {name2} about a time you stayed silent when you should have spoken up.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000001', 'spicy', 'What is one thing about your intimacy you want more of but struggle to request?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000001', 'spicy', 'When did you last cry, and did {name1} know?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000001', 'spicy', 'What is a sacrifice you made for this relationship that you have never mentioned?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000001', 'spicy', 'Tell {name2} one thing that always brings you back to feeling safe with {subject1}.', 2, 6, '{}', true);

-- ---------------------------------------------------------------------------
-- Connection — explicit × 20
-- REPLACE BEFORE LAUNCH — content team will populate via CMS
-- ---------------------------------------------------------------------------

INSERT INTO prompts (id, category_id, tier, body, min_group_size, max_group_size, relationship_structures, published) VALUES
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000001', 'explicit', 'What is the most emotionally raw moment you have ever shared with {name2}?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000001', 'explicit', 'Describe a time when vulnerability with {name1} led to unexpected closeness.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000001', 'explicit', 'What is the deepest fear you carry about being loved by {name2}?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000001', 'explicit', 'Tell {name1} what you have never been able to say after a fight.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000001', 'explicit', 'Describe the most intimate non-physical moment you have shared with {name2}.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000001', 'explicit', 'What part of yourself do you hide from {name1} out of shame, and are you ready to share it?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000001', 'explicit', 'Tell {name2} about a time you grieved something about your relationship alone.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000001', 'explicit', 'What would it mean to you to be truly, completely known by {name1}?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000001', 'explicit', 'Describe a moment you felt your heart break a little with {name2} and did not tell them.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000001', 'explicit', 'What is the most honest thing you could say about where you are right now in this relationship?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000001', 'explicit', 'Tell {name1} about a version of yourself you are afraid {subject1} would not love.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000001', 'explicit', 'What is the rawest emotion {name2} has ever witnessed in you?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000001', 'explicit', 'Describe a moment you chose connection over your ego with {name1}.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000001', 'explicit', 'What is something you have been protecting {name2} from knowing about you?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000001', 'explicit', 'Tell {name1} what intimacy means to you beyond the physical.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000001', 'explicit', 'What is a wound from your past that {name2} has quietly helped heal?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000001', 'explicit', 'Describe the moment you knew you were falling in love with {name1} and were terrified.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000001', 'explicit', 'What is a version of your future with {name2} that excites and scares you equally?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000001', 'explicit', 'Tell {name1} something you have only admitted to yourself at 3am.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000001', 'explicit', 'What does unconditional love look like from {name2}, in {possessive1} honest opinion?', 2, 6, '{}', true);


-- ---------------------------------------------------------------------------
-- Prompts — Curiosity (mild × 20)
-- REPLACE BEFORE LAUNCH — content team will populate via CMS
-- ---------------------------------------------------------------------------

INSERT INTO prompts (id, category_id, tier, body, min_group_size, max_group_size, relationship_structures, published) VALUES
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000002', 'mild', 'What is something {name2} is passionate about that you want to understand better?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000002', 'mild', 'What childhood memory shaped {possessive1} idea of what love looks like?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000002', 'mild', 'If {name1} could live anywhere in the world, where would {subject1} choose and why?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000002', 'mild', 'What is a book, film, or song that changed how {name2} sees the world?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000002', 'mild', 'What is something {name1} has always wanted to learn but never started?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000002', 'mild', 'How does {name2} decompress after a difficult day?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000002', 'mild', 'What is {possessive1} most unpopular opinion about something completely unimportant?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000002', 'mild', 'What does {name1} think the other person misunderstands about them?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000002', 'mild', 'What is a value {name2} holds that they rarely talk about?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000002', 'mild', 'What was {possessive1} dream job at age ten, and is any part of it still alive?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000002', 'mild', 'What small ritual makes {name2} feel like everything is going to be okay?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000002', 'mild', 'If {name1} could have dinner with anyone from history, who would {subject1} choose?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000002', 'mild', 'What is something {name2} is quietly proud of that most people do not know?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000002', 'mild', 'What part of {possessive2} personality surprises people who first meet them?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000002', 'mild', 'What is {name1} most curious about right now in {possessive1} own life?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000002', 'mild', 'What season best reflects {possessive2} personality and why?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000002', 'mild', 'What is something {name2} used to believe that they no longer do?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000002', 'mild', 'What superpower would {name1} choose, and what would {subject1} do with it?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000002', 'mild', 'How does {name2} know when they need more alone time?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000002', 'mild', 'What is one thing on {possessive1} bucket list that {name1} has never told their partner?', 2, 6, '{}', true);

-- Curiosity — spicy × 20
-- REPLACE BEFORE LAUNCH — content team will populate via CMS

INSERT INTO prompts (id, category_id, tier, body, min_group_size, max_group_size, relationship_structures, published) VALUES
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000002', 'spicy', 'What belief about relationships did {name1} grow up with that {subject1} has had to unlearn?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000002', 'spicy', 'What is something {name2} has judged in others that {subject2} secretly recognizes in themselves?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000002', 'spicy', 'What topic does {name1} avoid in conversation and why?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000002', 'spicy', 'What is {possessive2} relationship with failure, and how has it changed?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000002', 'spicy', 'What does {name1} wish {possessive1} family had taught them but did not?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000002', 'spicy', 'What is an assumption {name2} made about {name1} when they first met that turned out to be wrong?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000002', 'spicy', 'What is {possessive1} most complicated relationship with a family member, and how does it affect {name1} today?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000002', 'spicy', 'What would {name2} change about the way {subject2} was raised?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000002', 'spicy', 'Describe a moment {name1} felt genuinely misunderstood by someone {subject1} loves.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000002', 'spicy', 'What is something {name2} has never forgiven themselves for?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000002', 'spicy', 'What does {possessive1} definition of success look like now compared to five years ago?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000002', 'spicy', 'What is a version of {name1} that existed before this relationship that {possessive2} partner has never fully met?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000002', 'spicy', 'What does {name2} need to feel safe enough to be fully themselves?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000002', 'spicy', 'What is something {name1} is still trying to prove, and to whom?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000002', 'spicy', 'How has {possessive2} view of commitment evolved over time?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000002', 'spicy', 'What is a story {name1} tells about themselves that might not be fully true anymore?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000002', 'spicy', 'What does {name2} secretly envy about {name1}?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000002', 'spicy', 'What is the loneliest {name1} has ever felt, and did {subject1} tell anyone?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000002', 'spicy', 'What does {possessive2} inner critic say most often?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000002', 'spicy', 'What is a chapter of {possessive1} life that {name1} rarely opens, and why?', 2, 6, '{}', true);

-- Curiosity — explicit × 20
-- REPLACE BEFORE LAUNCH — content team will populate via CMS

INSERT INTO prompts (id, category_id, tier, body, min_group_size, max_group_size, relationship_structures, published) VALUES
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000002', 'explicit', 'What is the most transformative experience {name1} has ever had, and how did it reshape {subject1}?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000002', 'explicit', 'What is something {name2} has carried alone for years that {subject2} is ready to share?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000002', 'explicit', 'Describe a moment {name1} realized a core belief was wrong. What changed?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000002', 'explicit', 'What is {possessive2} most honest answer to the question: "Who am I becoming?"', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000002', 'explicit', 'What has {name1} learned about themselves through heartbreak?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000002', 'explicit', 'What would {name2} do differently if {subject2} knew {subject2} could not fail?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000002', 'explicit', 'What is the part of {possessive1} personality that {name1} finds hardest to love in themselves?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000002', 'explicit', 'Tell {name2} about a time you witnessed real courage in {subject1} that {subject2} has never acknowledged.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000002', 'explicit', 'What does {name1} think {subject1} is running toward, and what might {subject1} be running from?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000002', 'explicit', 'What is a pattern of behavior {name2} keeps repeating even though {subject2} knows better?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000002', 'explicit', 'What question does {name1} most want to be asked, but never is?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000002', 'explicit', 'What is {possessive2} relationship with their own body, and how has it shifted over time?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000002', 'explicit', 'What has loving {name2} taught {name1} about themselves?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000002', 'explicit', 'What is a story from {possessive1} past that {name1} has never told in full?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000002', 'explicit', 'What does {name2} believe is the most misunderstood thing about them?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000002', 'explicit', 'What is a dream {name1} gave up on, and does {subject1} still mourn it?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000002', 'explicit', 'What is the most honest thing {name2} can say about the life {subject2} is living right now?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000002', 'explicit', 'Tell {name1} about a time {subject2} envied {possessive1} life. What did it reveal?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000002', 'explicit', 'What does {name2} wish someone had told them at the start of their last relationship?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000002', 'explicit', 'What is {possessive1} deepest, least-spoken hope for who {name1} is becoming?', 2, 6, '{}', true);


-- ---------------------------------------------------------------------------
-- Prompts — Playful (mild × 20)
-- REPLACE BEFORE LAUNCH — content team will populate via CMS
-- ---------------------------------------------------------------------------

INSERT INTO prompts (id, category_id, tier, body, min_group_size, max_group_size, relationship_structures, published) VALUES
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000003', 'mild', 'If {name1} were a breakfast food, what would {subject1} be and why?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000003', 'mild', 'What is the silliest argument you have ever had with {name2}?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000003', 'mild', 'Do your best impression of {name1} ordering at a restaurant.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000003', 'mild', 'If your relationship were a movie genre, what would it be and why?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000003', 'mild', 'What is the weirdest thing {name2} does that you secretly find adorable?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000003', 'mild', 'If {name1} could only communicate in song titles for a day, which songs would {subject1} use most?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000003', 'mild', 'What game would {name2} dominate if you played right now?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000003', 'mild', 'Describe {name1} as a character in a children''s cartoon.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000003', 'mild', 'What would {possessive2} reality TV show be called?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000003', 'mild', 'If {name1} had a signature catchphrase, what would it be?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000003', 'mild', 'What is {name2}''s most dramatic overreaction to something trivial?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000003', 'mild', 'If you two were a duo in a heist movie, what would each person''s role be?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000003', 'mild', 'What is {possessive1} most ridiculous talent or hidden skill?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000003', 'mild', 'If {name2} were a dog breed, what would {subject2} be?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000003', 'mild', 'What would {name1}''s biography be titled?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000003', 'mild', 'What is the most chaotic decision you and {name2} have made together?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000003', 'mild', 'If {possessive2} laugh were a sound effect, what would it be?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000003', 'mild', 'What is {name1}''s go-to dance move, whether {subject1} admits it or not?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000003', 'mild', 'Design a theme park ride inspired by {possessive2} personality.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000003', 'mild', 'What embarrassing song does {name2} know every word to?', 2, 6, '{}', true);

-- Playful — spicy × 20
-- REPLACE BEFORE LAUNCH — content team will populate via CMS

INSERT INTO prompts (id, category_id, tier, body, min_group_size, max_group_size, relationship_structures, published) VALUES
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000003', 'spicy', 'Rate {name1}''s flirting skills out of ten and give specific feedback.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000003', 'spicy', 'What is the most ridiculous lie {name2} has ever told you with a straight face?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000003', 'spicy', 'If {name1} were a villain, what would {possessive1} evil plan be?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000003', 'spicy', 'What is the most unflattering photo you have of {name2}, and what is the story behind it?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000003', 'spicy', 'Truth or dare: describe {name1}''s most embarrassing public moment together.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000003', 'spicy', 'What would {name2}''s dating profile have looked like when you met, written honestly?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000003', 'spicy', 'What habit of {possessive1} would drive a roommate absolutely crazy?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000003', 'spicy', 'If {name1} starred in a trashy tabloid story, what would the headline be?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000003', 'spicy', 'What would {name2} do in a zombie apocalypse that would get everyone in trouble?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000003', 'spicy', 'What is the funniest misunderstanding you have ever had in bed?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000003', 'spicy', 'If {name1}''s phone search history told a story, what genre would it be?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000003', 'spicy', 'What is the worst gift {name2} has ever given or considered giving?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000003', 'spicy', 'Roast {name1}''s cooking in exactly three sentences.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000003', 'spicy', 'What is something {name2} does that {subject2} thinks is charming but is objectively chaotic?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000003', 'spicy', 'If your group had a sitcom episode written about last month, what would the plot be?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000003', 'spicy', 'What is {possessive2} pettiest victory in an argument?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000003', 'spicy', 'What is the most {name1} thing {name1} has ever done?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000003', 'spicy', 'If {name2} were a meme, which one would {subject2} be right now?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000003', 'spicy', 'Describe {possessive1} most unhinged late-night snack decision.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000003', 'spicy', 'What is the most passive-aggressive thing {name1} has ever done, and are {subject1} proud of it?', 2, 6, '{}', true);

-- Playful — explicit × 20
-- REPLACE BEFORE LAUNCH — content team will populate via CMS

INSERT INTO prompts (id, category_id, tier, body, min_group_size, max_group_size, relationship_structures, published) VALUES
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000003', 'explicit', 'What is the most ridiculous thing that has ever killed the mood, and can you laugh about it now?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000003', 'explicit', 'Tell {name1} about a time {subject2} used humor to avoid a genuine emotional moment.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000003', 'explicit', 'What is the most absurd dare {name2} would genuinely carry out?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000003', 'explicit', 'Invent a ridiculous couples award for {name1} and explain why {subject1} deserves it.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000003', 'explicit', 'What story about {name2} do you tell at parties that {subject2} probably wishes you would not?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000003', 'explicit', 'What is the most dramatic thing {name1} has ever done over something minor?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000003', 'explicit', 'If you wrote a comedy sketch about a fight you have had, what would the title be?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000003', 'explicit', 'What is the funniest thing {name2} has said or done that {subject2} has no memory of?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000003', 'explicit', 'Describe the most absurd date you have been on together.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000003', 'explicit', 'What would a blooper reel of your relationship look like?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000003', 'explicit', 'What is {possessive1} most chaotic quality that {name1} has finally learned to accept?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000003', 'explicit', 'What ongoing joke between you two would make zero sense to anyone else?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000003', 'explicit', 'If {name2}''s inner monologue were a podcast, what genre and title would it be?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000003', 'explicit', 'What is the silliest rule or agreement that exists in your relationship?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000003', 'explicit', 'Tell {name1} about a time laughter saved a genuinely terrible moment between you two.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000003', 'explicit', 'What would {name2}''s villain origin story be, told as a children''s book?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000003', 'explicit', 'Create a two-sentence review of {name1} as a partner, Yelp style.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000003', 'explicit', 'What is the most hilariously bad idea {name2} has ever enthusiastically pitched?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000003', 'explicit', 'What is one word that perfectly summarizes {name1}''s approach to plans?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000003', 'explicit', 'If your relationship had a mascot, what would it be and why does it reflect you both?', 2, 6, '{}', true);


-- ---------------------------------------------------------------------------
-- Prompts — Touch (mild × 20)
-- REPLACE BEFORE LAUNCH — content team will populate via CMS
-- ---------------------------------------------------------------------------

INSERT INTO prompts (id, category_id, tier, body, min_group_size, max_group_size, relationship_structures, published) VALUES
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000004', 'mild', 'Hold {name1}''s hand and take three slow breaths together without speaking.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000004', 'mild', 'Give {name2} a 60-second shoulder massage and check in on how it feels.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000004', 'mild', 'Where on your body do you most love to be touched by {name1}, and have you ever told them?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000004', 'mild', 'Ask {name2} to show you a type of touch that always calms {subject2} down.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000004', 'mild', 'Sit facing {name1}, make eye contact, and describe one physical thing you love about {subject1} right now.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000004', 'mild', 'What is {possessive2} favorite form of non-romantic physical affection — a hug, a back scratch, a head rub?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000004', 'mild', 'Place your hand over {name2}''s heart for ten seconds. What do you feel?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000004', 'mild', 'What type of hug from {name1} feels most like home to you?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000004', 'mild', 'What touch from {name2} immediately signals safety to your nervous system?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000004', 'mild', 'Ask {name1} to trace a shape on your back with {possessive1} finger and try to guess what it is.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000004', 'mild', 'What physical gesture from {name2} always makes you feel loved, even on a bad day?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000004', 'mild', 'Is there any type of touch you wish {name1} would offer more often?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000004', 'mild', 'Give {name2} a forehead touch and say one word that describes how you feel about them today.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000004', 'mild', 'Describe the last hug from {name1} that you still remember.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000004', 'mild', 'What physical affection do you give most naturally, and does {name2} appreciate it equally?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000004', 'mild', 'Hold both of {possessive1} hands and name one thing you appreciate about each.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000004', 'mild', 'Where does {name2} carry tension in their body right now? Offer to help release it.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000004', 'mild', 'What does it feel like to be hugged by {name1} after a long time apart?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000004', 'mild', 'Touch {name2}''s face gently and describe one feature you love looking at.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000004', 'mild', 'What is a form of physical comfort from {name1} that you have never asked for but secretly want?', 2, 6, '{}', true);

-- Touch — spicy × 20
-- REPLACE BEFORE LAUNCH — content team will populate via CMS

INSERT INTO prompts (id, category_id, tier, body, min_group_size, max_group_size, relationship_structures, published) VALUES
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000004', 'spicy', 'Ask {name1} to show you a type of touch {subject1} finds deeply relaxing that {subject1} has never demonstrated before.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000004', 'spicy', 'What part of {possessive2} body does {name2} feel most self-conscious about being touched?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000004', 'spicy', 'Tell {name1} about a time {possessive2} touch completely changed your emotional state.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000004', 'spicy', 'What is a way {name2} could touch you that {subject2} has never tried?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000004', 'spicy', 'Describe a specific moment when physical closeness with {name1} felt electric.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000004', 'spicy', 'What does touch deprivation feel like for you, and how do you communicate that to {name2}?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000004', 'spicy', 'Guide {name1}''s hands to show {subject1} exactly how you love to be held right now.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000004', 'spicy', 'What physical affection from {name2} do you crave but rarely ask for and why?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000004', 'spicy', 'Ask {name1} to give you a slow scalp massage and describe what you notice.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000004', 'spicy', 'What is the most memorable kiss you have shared with {name2}? Describe it in detail.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000004', 'spicy', 'How does your body respond differently to {possessive1} touch versus anyone else''s?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000004', 'spicy', 'Is there a way {name2} used to touch you that you miss and want back?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000004', 'spicy', 'Tell {name1} where on your body you feel most alive when touched.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000004', 'spicy', 'What does it mean to you when {name2} reaches for your hand in public?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000004', 'spicy', 'Spend two minutes giving {name1} a foot massage in silence.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000004', 'spicy', 'What physical boundary have you relaxed with {name2} over time, and why?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000004', 'spicy', 'Tell {name2} about a moment {possessive1} touch made you feel completely safe.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000004', 'spicy', 'What is a physical ritual you want to start with {name1}?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000004', 'spicy', 'How do you signal to {name2} that you need more physical affection without words?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000004', 'spicy', 'What is a touch from {name1} that you could happily receive every single day?', 2, 6, '{}', true);

-- Touch — explicit × 20
-- REPLACE BEFORE LAUNCH — content team will populate via CMS

INSERT INTO prompts (id, category_id, tier, body, min_group_size, max_group_size, relationship_structures, published) VALUES
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000004', 'explicit', 'Describe in detail what kind of touch from {name1} makes you feel most desired.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000004', 'explicit', 'What is something you have wanted {name2} to do with their hands that {subject2} has never tried?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000004', 'explicit', 'Tell {name1} about a specific touch that has stayed in your memory long after the moment passed.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000004', 'explicit', 'What part of {name2}''s body do you love touching most, and have you told {subject2} that?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000004', 'explicit', 'Describe a physical experience with {name1} that you want to recreate.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000004', 'explicit', 'What does your ideal evening of physical connection with {name2} look like from start to finish?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000004', 'explicit', 'What is a physical need that you have not clearly communicated to {name1}?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000004', 'explicit', 'Tell {name2} about the last time {possessive1} touch made your whole body respond.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000004', 'explicit', 'What is something you are curious to explore with {name1} in terms of touch?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000004', 'explicit', 'How has {possessive2} relationship with your own body changed since being with {name1}?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000004', 'explicit', 'What is the most uninhibited you have ever felt with {name2}, and what made it possible?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000004', 'explicit', 'Tell {name1} exactly what you would want {subject1} to do for the first ten minutes of your next intimate moment.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000004', 'explicit', 'What is something about {possessive2} physical presence that {name2} does not realize turns you on?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000004', 'explicit', 'Describe a fantasy about {name1} that centers entirely on slow, unhurried touch.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000004', 'explicit', 'What boundary around touch have you expanded with {name2}, and how did that change your connection?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000004', 'explicit', 'Tell {name1} what specific touch always signals intimacy is welcome.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000004', 'explicit', 'What is a part of your body you wish {name2} paid more attention to?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000004', 'explicit', 'Describe the mood, setting, and kind of touch that would make tonight feel extraordinary.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000004', 'explicit', 'What is a touch you give {name1} that you know always affects {subject1}, even when {subject1} does not say so?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000004', 'explicit', 'Tell {name2} about a physical moment together that felt like it transcended the ordinary.', 2, 6, '{}', true);


-- ---------------------------------------------------------------------------
-- Prompts — Fantasy (mild × 20)
-- REPLACE BEFORE LAUNCH — content team will populate via CMS
-- ---------------------------------------------------------------------------

INSERT INTO prompts (id, category_id, tier, body, min_group_size, max_group_size, relationship_structures, published) VALUES
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000005', 'mild', 'If {name1} and {name2} were characters in a fairy tale, what would the story be?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000005', 'mild', 'Describe the most romantic setting you can imagine sharing with {name2}.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000005', 'mild', 'If you and {name1} could spend one week anywhere in the world, completely unplanned, where would you go?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000005', 'mild', 'What is a dream date with {name2} that you have never been able to make happen yet?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000005', 'mild', 'If {name1} and you were in a movie, which genre and who would play you?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000005', 'mild', 'Invent a world where you and {name2} met in a completely different way. Tell the story.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000005', 'mild', 'If {name1} were a mythological figure, who would {subject1} be and why?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000005', 'mild', 'Describe your ideal alternate life with {name2} — different careers, city, everything.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000005', 'mild', 'What adventure with {name1} lives on your bucket list that you have never spoken aloud?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000005', 'mild', 'If you could give {name2} one magical ability, what would it be and why?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000005', 'mild', 'What does {possessive2} perfect day look like if money and logistics were no object?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000005', 'mild', 'If {name1} wrote a love letter set in a fantasy universe, what world would {subject1} build?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000005', 'mild', 'You and {name2} are time travelers. Where and when do you go first?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000005', 'mild', 'What fictional couple from a book or film reminds you most of you and {name1}?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000005', 'mild', 'Paint a picture in words of a perfect evening with {name2} ten years from now.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000005', 'mild', 'If {name1}''s inner world were a landscape, what would it look like?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000005', 'mild', 'What song would play if your relationship had a cinematic opening scene?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000005', 'mild', 'If {name2} were a character in a video game, what would {possessive2} special power be?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000005', 'mild', 'Imagine you and {name1} are meeting for the first time in a story you write right now.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000005', 'mild', 'What is a recurring daydream you have about your future with {name2}?', 2, 6, '{}', true);

-- Fantasy — spicy × 20
-- REPLACE BEFORE LAUNCH — content team will populate via CMS

INSERT INTO prompts (id, category_id, tier, body, min_group_size, max_group_size, relationship_structures, published) VALUES
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000005', 'spicy', 'Describe a scenario where {name1} surprises you in a way that makes your pulse race.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000005', 'spicy', 'What is a playful role or scenario you have imagined with {name2} but never suggested?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000005', 'spicy', 'If {name1} planned a completely spontaneous overnight escape for you, what would the ideal itinerary be?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000005', 'spicy', 'Describe an alternate universe where you and {name2} are strangers meeting tonight.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000005', 'spicy', 'What is a daring thing you have imagined doing with {name1} that you have never voiced?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000005', 'spicy', 'If you two could disappear together for 48 hours with no phone and no agenda, what would happen?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000005', 'spicy', 'Tell {name2} about a fantasy version of your relationship that feels thrilling to imagine.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000005', 'spicy', 'What is a place where you have imagined being alone with {name1} that you have never been?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000005', 'spicy', 'If {name2} could seduce you in an entirely new way, what would {subject2} do?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000005', 'spicy', 'Describe the most adventurous thing you can imagine doing with {name1} that stays just within your comfort zone.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000005', 'spicy', 'What is an aesthetic or atmosphere that makes you want to be close to {name2}?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000005', 'spicy', 'If your relationship had a secret identity, what would it be?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000005', 'spicy', 'Describe a fantasy vacation with {name1} where the journey itself is the adventure.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000005', 'spicy', 'What is something {name2} could wear, say, or do that would make you weak in the knees?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000005', 'spicy', 'Tell {name1} about the most vivid daydream you have had about {subject1} recently.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000005', 'spicy', 'What is a playful power dynamic you have been curious to explore with {name2}?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000005', 'spicy', 'If {name1} could choreograph your ideal intimate evening, what would act one look like?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000005', 'spicy', 'What location or setting has always felt charged or romantic to you when you are with {name2}?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000005', 'spicy', 'Describe the version of {name1} that appears in {possessive2} most exciting daydreams.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000005', 'spicy', 'What is a completely new experience {name2} could introduce you to that would excite rather than frighten you?', 2, 6, '{}', true);

-- Fantasy — explicit × 20
-- REPLACE BEFORE LAUNCH — content team will populate via CMS

INSERT INTO prompts (id, category_id, tier, body, min_group_size, max_group_size, relationship_structures, published) VALUES
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000005', 'explicit', 'Tell {name1} about a specific fantasy involving them that you have held back sharing.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000005', 'explicit', 'Describe a scenario where you take complete control in a way {name2} would love.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000005', 'explicit', 'What is a desire you have imagined with {name1} that feels just outside what you have tried?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000005', 'explicit', 'Tell {name2} about a recurring fantasy that stars {subject1}.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000005', 'explicit', 'What is the most charged scenario you can imagine with {name1} that you have never articulated?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000005', 'explicit', 'Describe an experience with {name2} that exists only in your imagination but feels vivid.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000005', 'explicit', 'What is one thing {name1} could say that would instantly shift your energy?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000005', 'explicit', 'Tell {name2} about a fantasy where the setting or atmosphere is as important as the acts.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000005', 'explicit', 'What element of surprise from {name1} would make a moment unforgettable for you?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000005', 'explicit', 'Describe the most intimate fantasy you have about the way a night with {name2} unfolds.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000005', 'explicit', 'What is a scenario where {name1} is completely themselves and it absolutely undoes you?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000005', 'explicit', 'Tell {name2} about a fantasy that begins with something mundane and becomes extraordinary.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000005', 'explicit', 'What desire have you had about {name1} that surprised even you?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000005', 'explicit', 'Describe a fantasy with {name2} where you feel completely free of self-consciousness.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000005', 'explicit', 'What is the most honest thing you can say about what you want {name1} to do to you?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000005', 'explicit', 'Tell {name2} about a scenario where slowing everything way down is the entire point.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000005', 'explicit', 'What is something you want to do with {name1} that you have only ever imagined in the dark?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000005', 'explicit', 'Describe a scenario involving {name2} that combines tenderness and desire in equal measure.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000005', 'explicit', 'What is a fantasy that you want to propose turning into a reality with {name1}?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000005', 'explicit', 'Tell {name2} one thing you desire that you have been afraid {subject2} might not share.', 2, 6, '{}', true);


-- ---------------------------------------------------------------------------
-- Prompts — Adventure (mild × 20)
-- REPLACE BEFORE LAUNCH — content team will populate via CMS
-- ---------------------------------------------------------------------------

INSERT INTO prompts (id, category_id, tier, body, min_group_size, max_group_size, relationship_structures, published) VALUES
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000006', 'mild', 'Plan a spontaneous day trip with {name2} right now — where are you going?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000006', 'mild', 'What is one thing {name1} has never done that {subject1} has always wanted to try?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000006', 'mild', 'Challenge {name2} to try a new food or cuisine together this week. What will you pick?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000006', 'mild', 'What is a hobby or skill {name1} has wanted to learn together with {possessive1} partner?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000006', 'mild', 'Describe the most adventurous thing you have done together and whether you would do it again.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000006', 'mild', 'Pick a random country on a map. Plan a two-week trip there with {name2} from scratch.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000006', 'mild', 'What local experience in {possessive1} city have you and {name1} still not had?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000006', 'mild', 'What is something {name2} would do solo that {subject2} has not yet brought into the relationship?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000006', 'mild', 'Commit to one new shared experience before next month. What will it be?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000006', 'mild', 'If {name1} had to teach {name2} one skill {subject1} has, what would it be?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000006', 'mild', 'What is something you are both bad at that you could try to get better at together?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000006', 'mild', 'Name one restaurant, trail, or neighborhood you and {name2} keep meaning to explore.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000006', 'mild', 'What season activity have you and {name1} never done together but always talked about?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000006', 'mild', 'Describe the perfect road trip with {name2}: destination, playlist, snacks, stops.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000006', 'mild', 'What is one thing {name1} could plan as a surprise for {name2} this month?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000006', 'mild', 'If you had one free Saturday with no obligations, what adventure would you and {name2} go on?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000006', 'mild', 'What is a fear {name1} wants to gently face with {name2} by {possessive1} side?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000006', 'mild', 'Plan a romantic picnic with {name2} — location, menu, one unexpected detail.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000006', 'mild', 'What creative project could you and {name1} build together, just for fun?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000006', 'mild', 'Describe your dream adventure with {name2} that involves zero technology.', 2, 6, '{}', true);

-- Adventure — spicy × 20
-- REPLACE BEFORE LAUNCH — content team will populate via CMS

INSERT INTO prompts (id, category_id, tier, body, min_group_size, max_group_size, relationship_structures, published) VALUES
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000006', 'spicy', 'What is a daring public adventure you have imagined doing with {name2} but held back on?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000006', 'spicy', 'If {name1} could dare {name2} to try one thing this month, what would it be?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000006', 'spicy', 'What is a boundary you want to push together — a new place, experience, or situation?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000006', 'spicy', 'Plan an evening where neither of you knows what happens next. Where does it begin?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000006', 'spicy', 'What is the most spontaneous thing {name2} has ever done that swept you off your feet?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000006', 'spicy', 'What is one rule or habit in your relationship that {name1} would like to break just for a day?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000006', 'spicy', 'Describe an outdoor setting where you could imagine being completely uninhibited with {name2}.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000006', 'spicy', 'What is an experience involving mild risk or novelty that would bring you and {name1} closer?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000006', 'spicy', 'If {name2} planned a daring date, what three clues would {subject2} leave to build anticipation?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000006', 'spicy', 'What is a social setting where {name1} and {name2} have never flirted, and should try?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000006', 'spicy', 'Dare {name2} to tell a stranger something genuinely kind while you watch.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000006', 'spicy', 'What is the most adventurous meal you could cook or order together this week?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000006', 'spicy', 'Plan a 24-hour adventure with {name1} that starts with a coin flip.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000006', 'spicy', 'What is one thing {name2} has never done that {subject2} is secretly curious about?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000006', 'spicy', 'What would a night where you both let go of every habit look like?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000006', 'spicy', 'If {name1} could choreograph the most exciting possible Saturday with {name2}, what happens?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000006', 'spicy', 'What is a location — a rooftop, a forest, a beach at midnight — where you want to be with {name2}?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000006', 'spicy', 'Plan a date for {name2} that involves three surprises, each escalating in unexpected-ness.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000006', 'spicy', 'What is a challenge you want to take on together this year that will push you both?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000006', 'spicy', 'Describe a midnight adventure with {name1} that you have fantasized about but not yet planned.', 2, 6, '{}', true);

-- Adventure — explicit × 20
-- REPLACE BEFORE LAUNCH — content team will populate via CMS

INSERT INTO prompts (id, category_id, tier, body, min_group_size, max_group_size, relationship_structures, published) VALUES
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000006', 'explicit', 'Describe an adventure with {name2} that involves complete sensory immersion.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000006', 'explicit', 'What is something bold {name1} wants to try with {name2} that would require real trust?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000006', 'explicit', 'If you and {name2} had one night with zero social constraints, what would it look like?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000006', 'explicit', 'Tell {name1} about an experience you want to have together that would make a great secret.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000006', 'explicit', 'Plan a spontaneous weekend with {name2} where the only rule is no planning allowed.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000006', 'explicit', 'What is a daring act of intimacy — physical or emotional — that you have not yet been brave enough to initiate with {name1}?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000006', 'explicit', 'Describe a scenario where you and {name2} push a boundary together and come out closer.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000006', 'explicit', 'What is the most exposed — physically, emotionally, or both — you have ever been with {name1}?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000006', 'explicit', 'Tell {name2} about an adventure {subject2} has imagined that would require both of you to be completely present.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000006', 'explicit', 'What experience with {name1} have you wanted to have that lives at the edge of your comfort zone?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000006', 'explicit', 'Describe a fantasy adventure that involves surrender — emotional, physical, or both.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000006', 'explicit', 'What is a place or setting where you imagine letting go completely with {name2}?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000006', 'explicit', 'Plan a dare for {name1} that would require vulnerability and courage in equal measure.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000006', 'explicit', 'What is something you want to experience with {name2} that is slightly forbidden by your own habits?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000006', 'explicit', 'Describe the most intimate adventure you can conceive of for you and {name1}.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000006', 'explicit', 'What is a night with {name2} that would leave you both changed in some small way?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000006', 'explicit', 'Tell {name1} about something you want to try that only works if you both say yes simultaneously.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000006', 'explicit', 'What challenge involving {name2} would require you to be fully present the whole time?', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000006', 'explicit', 'Describe an experience with {name1} that has no script, no plan, and no escape hatch.', 2, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000006', 'explicit', 'What is the most alive you have ever felt with {name2}, and how do you get back there?', 2, 6, '{}', true);



-- ---------------------------------------------------------------------------
-- Prompts -- Lifestyle (mild x 20) -- ENM/swinger targeted
-- REPLACE BEFORE LAUNCH -- content team will populate via CMS
-- ---------------------------------------------------------------------------

INSERT INTO prompts (id, category_id, tier, body, min_group_size, max_group_size, relationship_structures, published) VALUES
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000007', 'mild', 'What drew {name1} to an open relationship model, and has that reason evolved?', 2, 6, ARRAY['open','swinger','polyamorous','ENM','thruple','quad','constellation','exploring'], true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000007', 'mild', 'How do you and {name2} decide together when to explore connections outside your partnership?', 2, 6, ARRAY['open','swinger','polyamorous','ENM','thruple','quad','constellation','exploring'], true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000007', 'mild', 'What is one check-in ritual you and {name1} rely on to stay connected after outside experiences?', 2, 6, ARRAY['open','swinger','polyamorous','ENM','thruple','quad','constellation','exploring'], true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000007', 'mild', 'Tell {name2} one thing about your lifestyle that you are proud of, that most people would not understand.', 2, 6, ARRAY['open','swinger','polyamorous','ENM','thruple','quad','constellation','exploring'], true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000007', 'mild', 'What value does openness or non-monogamy bring to your relationship with {name1}?', 2, 6, ARRAY['open','swinger','polyamorous','ENM','thruple','quad','constellation','exploring'], true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000007', 'mild', 'How has navigating the lifestyle made {name2} more skilled at communicating with you?', 2, 6, ARRAY['open','swinger','polyamorous','ENM','thruple','quad','constellation','exploring'], true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000007', 'mild', 'What is one agreement with {name1} that you both arrived at through experience rather than theory?', 2, 6, ARRAY['open','swinger','polyamorous','ENM','thruple','quad','constellation','exploring'], true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000007', 'mild', 'What would you want a friend to understand about your relationship with {name2} before judging it?', 2, 6, ARRAY['open','swinger','polyamorous','ENM','thruple','quad','constellation','exploring'], true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000007', 'mild', 'What does compersion feel like for you when {name1} experiences joy with someone else?', 2, 6, ARRAY['open','swinger','polyamorous','ENM','thruple','quad','constellation','exploring'], true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000007', 'mild', 'How do you and {name2} protect your primary bond while staying open to other connections?', 2, 6, ARRAY['open','swinger','polyamorous','ENM','thruple','quad','constellation','exploring'], true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000007', 'mild', 'What is a misconception about the lifestyle that {name1} had before experiencing it?', 2, 6, ARRAY['open','swinger','polyamorous','ENM','thruple','quad','constellation','exploring'], true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000007', 'mild', 'What community or event has meant the most to you and {name2} in your lifestyle journey?', 2, 6, ARRAY['open','swinger','polyamorous','ENM','thruple','quad','constellation','exploring'], true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000007', 'mild', 'Tell {name1} one thing about {possessive2} approach to non-monogamy that you genuinely admire.', 2, 6, ARRAY['open','swinger','polyamorous','ENM','thruple','quad','constellation','exploring'], true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000007', 'mild', 'What is a book, podcast, or resource that shaped how you both think about your relationship model?', 2, 6, ARRAY['open','swinger','polyamorous','ENM','thruple','quad','constellation','exploring'], true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000007', 'mild', 'How do you want {name2} to handle it if {subject2} ever feels unsure about an outside connection?', 2, 6, ARRAY['open','swinger','polyamorous','ENM','thruple','quad','constellation','exploring'], true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000007', 'mild', 'What is one thing {name1} does in the lifestyle that makes you feel especially proud of {subject1}?', 2, 6, ARRAY['open','swinger','polyamorous','ENM','thruple','quad','constellation','exploring'], true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000007', 'mild', 'How has living openly changed what you appreciate most about your bond with {name2}?', 2, 6, ARRAY['open','swinger','polyamorous','ENM','thruple','quad','constellation','exploring'], true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000007', 'mild', 'What does your dream social circle in the lifestyle look like for you and {name1}?', 2, 6, ARRAY['open','swinger','polyamorous','ENM','thruple','quad','constellation','exploring'], true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000007', 'mild', 'Tell {name2} about a moment when you knew your ENM structure was right for you both.', 2, 6, ARRAY['open','swinger','polyamorous','ENM','thruple','quad','constellation','exploring'], true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000007', 'mild', 'What is one upgrade you would make to your current relationship agreements with {name1}?', 2, 6, ARRAY['open','swinger','polyamorous','ENM','thruple','quad','constellation','exploring'], true);

-- Lifestyle -- spicy x 20
-- REPLACE BEFORE LAUNCH -- content team will populate via CMS

INSERT INTO prompts (id, category_id, tier, body, min_group_size, max_group_size, relationship_structures, published) VALUES
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000007', 'spicy', 'Tell {name1} about a jealousy moment you had and what you discovered about yourself from it.', 2, 6, ARRAY['open','swinger','polyamorous','ENM','thruple','quad','constellation','exploring'], true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000007', 'spicy', 'What is an outside experience that unexpectedly brought you and {name2} closer?', 2, 6, ARRAY['open','swinger','polyamorous','ENM','thruple','quad','constellation','exploring'], true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000007', 'spicy', 'Describe a moment at a lifestyle event where you felt most proud of yourself and {name1}.', 2, 6, ARRAY['open','swinger','polyamorous','ENM','thruple','quad','constellation','exploring'], true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000007', 'spicy', 'What is one boundary {name2} currently holds that {subject2} might be ready to renegotiate?', 2, 6, ARRAY['open','swinger','polyamorous','ENM','thruple','quad','constellation','exploring'], true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000007', 'spicy', 'Tell {name1} about a connection outside your partnership that taught you something about yourself.', 2, 6, ARRAY['open','swinger','polyamorous','ENM','thruple','quad','constellation','exploring'], true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000007', 'spicy', 'What is the most emotionally complex part of living openly that you and {name2} have navigated?', 2, 6, ARRAY['open','swinger','polyamorous','ENM','thruple','quad','constellation','exploring'], true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000007', 'spicy', 'Describe a type of outside connection that {name1} finds most fulfilling and why.', 2, 6, ARRAY['open','swinger','polyamorous','ENM','thruple','quad','constellation','exploring'], true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000007', 'spicy', 'What is something {name2} does in the lifestyle that you find deeply attractive?', 2, 6, ARRAY['open','swinger','polyamorous','ENM','thruple','quad','constellation','exploring'], true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000007', 'spicy', 'Tell {name1} what you felt watching {subject1} connect with someone else for the first time.', 2, 6, ARRAY['open','swinger','polyamorous','ENM','thruple','quad','constellation','exploring'], true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000007', 'spicy', 'What aspect of your lifestyle would you most want to explore more deeply with {name2}?', 2, 6, ARRAY['open','swinger','polyamorous','ENM','thruple','quad','constellation','exploring'], true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000007', 'spicy', 'How do you and {name1} handle it when an outside connection develops deeper feelings?', 2, 6, ARRAY['open','swinger','polyamorous','ENM','thruple','quad','constellation','exploring'], true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000007', 'spicy', 'What is the bravest thing you have done in your lifestyle journey with {name2}?', 2, 6, ARRAY['open','swinger','polyamorous','ENM','thruple','quad','constellation','exploring'], true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000007', 'spicy', 'Tell {name2} about a desire in the lifestyle you have been hesitant to voice.', 2, 6, ARRAY['open','swinger','polyamorous','ENM','thruple','quad','constellation','exploring'], true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000007', 'spicy', 'What is a type of event or experience you want to have with {name1} that you have not yet tried?', 2, 6, ARRAY['open','swinger','polyamorous','ENM','thruple','quad','constellation','exploring'], true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000007', 'spicy', 'Describe the most profound conversation you and {name2} have had because of your lifestyle.', 2, 6, ARRAY['open','swinger','polyamorous','ENM','thruple','quad','constellation','exploring'], true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000007', 'spicy', 'What is something about {possessive1} relationship with jealousy that has shifted since opening up?', 2, 6, ARRAY['open','swinger','polyamorous','ENM','thruple','quad','constellation','exploring'], true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000007', 'spicy', 'Tell {name1} about a moment where compersion surprised you with its intensity.', 2, 6, ARRAY['open','swinger','polyamorous','ENM','thruple','quad','constellation','exploring'], true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000007', 'spicy', 'What is your honest answer to: how are our agreements serving us right now?', 2, 6, ARRAY['open','swinger','polyamorous','ENM','thruple','quad','constellation','exploring'], true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000007', 'spicy', 'What is a new agreement with {name2} you want to propose based on what you have learned?', 2, 6, ARRAY['open','swinger','polyamorous','ENM','thruple','quad','constellation','exploring'], true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000007', 'spicy', 'How has living openly changed what intimacy means to you with {name1}?', 2, 6, ARRAY['open','swinger','polyamorous','ENM','thruple','quad','constellation','exploring'], true);

-- Lifestyle -- explicit x 20
-- REPLACE BEFORE LAUNCH -- content team will populate via CMS

INSERT INTO prompts (id, category_id, tier, body, min_group_size, max_group_size, relationship_structures, published) VALUES
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000007', 'explicit', 'Describe a specific shared experience in the lifestyle that you and {name2} still talk about.', 2, 6, ARRAY['open','swinger','polyamorous','ENM','thruple','quad','constellation','exploring'], true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000007', 'explicit', 'Tell {name1} what you most want from your next lifestyle experience together.', 2, 6, ARRAY['open','swinger','polyamorous','ENM','thruple','quad','constellation','exploring'], true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000007', 'explicit', 'What type of connection or dynamic have you wanted to explore with {name2} but have not yet proposed?', 2, 6, ARRAY['open','swinger','polyamorous','ENM','thruple','quad','constellation','exploring'], true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000007', 'explicit', 'Describe the ideal lifestyle experience with {name1} from first flirtation to returning home.', 2, 6, ARRAY['open','swinger','polyamorous','ENM','thruple','quad','constellation','exploring'], true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000007', 'explicit', 'What is something you have seen others do in the lifestyle that you want to explore with {name2}?', 2, 6, ARRAY['open','swinger','polyamorous','ENM','thruple','quad','constellation','exploring'], true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000007', 'explicit', 'Tell {name1} about an outside experience that made you feel most connected to {subject1} afterward.', 2, 6, ARRAY['open','swinger','polyamorous','ENM','thruple','quad','constellation','exploring'], true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000007', 'explicit', 'What is a fantasy involving {name2} and the lifestyle that you have been building in your imagination?', 2, 6, ARRAY['open','swinger','polyamorous','ENM','thruple','quad','constellation','exploring'], true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000007', 'explicit', 'Describe in detail what aftercare looks like between you and {name1} after an intense shared experience.', 2, 6, ARRAY['open','swinger','polyamorous','ENM','thruple','quad','constellation','exploring'], true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000007', 'explicit', 'What specific desire have you never fully articulated to {name2} about your shared lifestyle exploration?', 2, 6, ARRAY['open','swinger','polyamorous','ENM','thruple','quad','constellation','exploring'], true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000007', 'explicit', 'Tell {name1} exactly what {subject2} finds most attractive about watching them in a lifestyle context.', 2, 6, ARRAY['open','swinger','polyamorous','ENM','thruple','quad','constellation','exploring'], true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000007', 'explicit', 'What is the most charged lifestyle scenario you have imagined that you would need {name2} full consent to explore?', 2, 6, ARRAY['open','swinger','polyamorous','ENM','thruple','quad','constellation','exploring'], true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000007', 'explicit', 'Describe a night with {name1} and another connection that would leave everyone feeling seen and respected.', 2, 6, ARRAY['open','swinger','polyamorous','ENM','thruple','quad','constellation','exploring'], true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000007', 'explicit', 'What is something {name2} does in intimate contexts that you have never stopped finding exciting?', 2, 6, ARRAY['open','swinger','polyamorous','ENM','thruple','quad','constellation','exploring'], true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000007', 'explicit', 'Tell {name1} what makes {subject1} exceptional as a partner in the lifestyle compared to anyone you have encountered.', 2, 6, ARRAY['open','swinger','polyamorous','ENM','thruple','quad','constellation','exploring'], true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000007', 'explicit', 'Describe a three-stage lifestyle date with {name2} -- before, during, and the reconnection at the end.', 2, 6, ARRAY['open','swinger','polyamorous','ENM','thruple','quad','constellation','exploring'], true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000007', 'explicit', 'What is the most vulnerable {name1} has ever been with you in a lifestyle context, and what did that mean to you?', 2, 6, ARRAY['open','swinger','polyamorous','ENM','thruple','quad','constellation','exploring'], true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000007', 'explicit', 'What is a dynamic -- voyeuristic, participatory, dominant, or receiving -- that excites you most with {name2}?', 2, 6, ARRAY['open','swinger','polyamorous','ENM','thruple','quad','constellation','exploring'], true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000007', 'explicit', 'Tell {name2} about a desire you have that requires open, honest negotiation before you could try it.', 2, 6, ARRAY['open','swinger','polyamorous','ENM','thruple','quad','constellation','exploring'], true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000007', 'explicit', 'What does the ideal version of your shared lifestyle exploration look like five years from now with {name1}?', 2, 6, ARRAY['open','swinger','polyamorous','ENM','thruple','quad','constellation','exploring'], true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000007', 'explicit', 'Tell {name1} the single most honest thing you could say about what living openly has done for your desire for {subject1}.', 2, 6, ARRAY['open','swinger','polyamorous','ENM','thruple','quad','constellation','exploring'], true);

-- ---------------------------------------------------------------------------
-- Prompts -- Group Dynamics (mild x 20) -- 3+ members
-- REPLACE BEFORE LAUNCH -- content team will populate via CMS
-- ---------------------------------------------------------------------------

INSERT INTO prompts (id, category_id, tier, body, min_group_size, max_group_size, relationship_structures, published) VALUES
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000008', 'mild', 'Go around the group: each person names one quality they love about the person to their left.', 3, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000008', 'mild', 'What is one thing all of you share that you have never actually named out loud?', 3, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000008', 'mild', 'Name one thing each person in this group does that makes the whole group stronger.', 3, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000008', 'mild', 'What is the unwritten rule of your group that everyone follows but no one has stated?', 3, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000008', 'mild', 'Have each person share a memory of a moment this group made them laugh until it hurt.', 3, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000008', 'mild', 'What is one thing the group could do more of together that everyone would enjoy?', 3, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000008', 'mild', 'Go around: each person names the superpower the person to their right brings to the group.', 3, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000008', 'mild', 'What is something the group has built together that none of you could have built alone?', 3, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000008', 'mild', 'Describe the moment each person joined this constellation and how the dynamic shifted.', 3, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000008', 'mild', 'What is a shared ritual the group wants to start?', 3, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000008', 'mild', 'Each person: name one thing you appreciate about the group communication style.', 3, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000008', 'mild', 'What does this group do best when everyone is at their best?', 3, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000008', 'mild', 'Go around: share one thing you were nervous about when you first joined this group.', 3, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000008', 'mild', 'What adventure could this group only have together -- not in pairs?', 3, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000008', 'mild', 'Name a memory with the whole group that you would want to relive.', 3, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000008', 'mild', 'What would a documentary about this group be called and what would its thesis be?', 3, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000008', 'mild', 'Have each person finish this sentence: this group is at its best when...', 3, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000008', 'mild', 'What is one way each person shows love that is uniquely theirs?', 3, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000008', 'mild', 'What three words would each person use to describe the energy of this group?', 3, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000008', 'mild', 'If this group had a theme song, what would it be and why does everyone agree?', 3, 6, '{}', true);

-- Group Dynamics -- spicy x 20
-- REPLACE BEFORE LAUNCH -- content team will populate via CMS

INSERT INTO prompts (id, category_id, tier, body, min_group_size, max_group_size, relationship_structures, published) VALUES
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000008', 'spicy', 'Is there a dynamic in the group that everyone feels but no one has named? Name it now.', 3, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000008', 'spicy', 'Tell the group about a moment you felt left out and did not say anything.', 3, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000008', 'spicy', 'What is a tension in the group that you think needs to be aired?', 3, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000008', 'spicy', 'Go around: each person says one honest thing they have never told the full group.', 3, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000008', 'spicy', 'What is a need you have within this group that you have been meeting only halfway?', 3, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000008', 'spicy', 'What is the hardest conversation this group has ever had, and did it bring you closer?', 3, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000008', 'spicy', 'Is there a role you play in this group that you would like to step out of?', 3, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000008', 'spicy', 'Each person: share a moment you felt jealous of a dynamic within the group.', 3, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000008', 'spicy', 'What agreement does this group still need to make explicit?', 3, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000008', 'spicy', 'Describe a time when the group needs pulled in different directions. How did you navigate it?', 3, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000008', 'spicy', 'What is something a smaller pair within the group has that the full group sometimes misses?', 3, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000008', 'spicy', 'Tell the group one thing you have been too careful to say. Say it now, gently.', 3, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000008', 'spicy', 'How does each person feel about how time and attention are distributed in the group?', 3, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000008', 'spicy', 'What is a fear each person carries about the group future?', 3, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000008', 'spicy', 'Which relationship pairing within the group do you feel needs the most dedicated time right now?', 3, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000008', 'spicy', 'What is something you wish was different about how the group makes decisions?', 3, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000008', 'spicy', 'Each person: what is your unmet need from the group this week?', 3, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000008', 'spicy', 'Describe a moment in the group when you felt a connection you had not expected.', 3, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000008', 'spicy', 'What would change in this group if everyone said exactly what they needed every day?', 3, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000008', 'spicy', 'What is one way the group could better support each individual growth?', 3, 6, '{}', true);

-- Group Dynamics -- explicit x 20
-- REPLACE BEFORE LAUNCH -- content team will populate via CMS

INSERT INTO prompts (id, category_id, tier, body, min_group_size, max_group_size, relationship_structures, published) VALUES
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000008', 'explicit', 'Describe the most intimate moment the whole group has shared that changed something.', 3, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000008', 'explicit', 'What does each person need to feel fully seen and desired within this group?', 3, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000008', 'explicit', 'Tell the group about a desire you have involving the whole constellation that you have not voiced.', 3, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000008', 'explicit', 'What is something each person does that the group finds irresistible?', 3, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000008', 'explicit', 'Describe an experience the whole group could share that would deepen everyone bond.', 3, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000008', 'explicit', 'What is a fantasy about the group dynamic that you have been afraid to share?', 3, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000008', 'explicit', 'Go around: each person tells the group what makes them feel most desired.', 3, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000008', 'explicit', 'What is the most vulnerable thing each person in the group can say about their place in it?', 3, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000008', 'explicit', 'Describe an ideal night for the whole group where everyone leaves feeling completely satisfied.', 3, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000008', 'explicit', 'What does each person need to feel emotionally safe enough to be completely unguarded?', 3, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000008', 'explicit', 'Tell the group one thing you love about each person energy in intimate moments.', 3, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000008', 'explicit', 'What is something the group has never tried together that everyone is secretly curious about?', 3, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000008', 'explicit', 'Describe a moment of group intimacy where you felt everyone connection simultaneously.', 3, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000008', 'explicit', 'What is one desire each person has that they could only fulfill with this specific group?', 3, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000008', 'explicit', 'Tell the group what aftercare looks like for you and what the group can offer.', 3, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000008', 'explicit', 'What is the most honest thing each person can say about what they want from this group right now?', 3, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000008', 'explicit', 'Describe a scenario where every person in the group feels equally central.', 3, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000008', 'explicit', 'What is a boundary each person holds that the group needs to honor explicitly?', 3, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000008', 'explicit', 'Tell the group about a desire that has grown stronger since joining this constellation.', 3, 6, '{}', true),
  (gen_random_uuid(), '11111111-0000-0000-0000-000000000008', 'explicit', 'What would each person want the others to know about how they experience desire within this group?', 3, 6, '{}', true);


-- ---------------------------------------------------------------------------
-- Prompt Packs
-- ---------------------------------------------------------------------------

INSERT INTO prompt_packs (id, slug, name, description, is_premium, sku, sort_order, active, relationship_structures) VALUES
  ('22222222-0000-0000-0000-000000000001', 'starter-free',    'Starter',        'Your first 30 questions -- a warm welcome to Ember',                      false, NULL,                      1, true, NULL),
  ('22222222-0000-0000-0000-000000000002', 'newlywed',        'Newlywed',       'Deepen your bond in the first years of commitment',                        true,  'ember_pack_newlywed',     2, true, NULL),
  ('22222222-0000-0000-0000-000000000003', 'long-distance',   'Long Distance',  'Stay close when you are miles apart',                                      true,  'ember_pack_longdistance', 3, true, NULL),
  ('22222222-0000-0000-0000-000000000004', 'reconnect',       'Reconnect',      'Rediscover each other after a busy season',                                false, NULL,                      4, true, NULL),
  ('22222222-0000-0000-0000-000000000005', 'lifestyle-intro', 'Lifestyle Intro','A thoughtful starting point for ENM and open relationship exploration',    true,  'ember_pack_lifestyle',    5, true, ARRAY['open','swinger','polyamorous','ENM','thruple','quad','constellation','exploring']);

-- ---------------------------------------------------------------------------
-- Pack items: seed each pack with relevant prompts
-- ---------------------------------------------------------------------------

-- Starter (free): Connection mild + Curiosity mild, up to 30
INSERT INTO prompt_pack_items (pack_id, prompt_id, sort_order)
SELECT
  '22222222-0000-0000-0000-000000000001',
  p.id,
  (ROW_NUMBER() OVER (ORDER BY p.created_at) - 1)
FROM prompts p
JOIN categories c ON c.id = p.category_id
WHERE c.slug IN ('connection', 'curiosity')
  AND p.tier = 'mild'
  AND p.published = true
LIMIT 30;

-- Reconnect (free): Connection + Touch + Fantasy spicy, up to 30
INSERT INTO prompt_pack_items (pack_id, prompt_id, sort_order)
SELECT
  '22222222-0000-0000-0000-000000000004',
  p.id,
  (ROW_NUMBER() OVER (ORDER BY p.created_at) - 1)
FROM prompts p
JOIN categories c ON c.id = p.category_id
WHERE c.slug IN ('connection', 'touch', 'fantasy')
  AND p.tier = 'spicy'
  AND p.published = true
LIMIT 30;

-- Newlywed (premium): Connection + Touch + Curiosity mild+spicy, up to 40
INSERT INTO prompt_pack_items (pack_id, prompt_id, sort_order)
SELECT
  '22222222-0000-0000-0000-000000000002',
  p.id,
  (ROW_NUMBER() OVER (ORDER BY p.created_at) - 1)
FROM prompts p
JOIN categories c ON c.id = p.category_id
WHERE c.slug IN ('connection', 'touch', 'curiosity')
  AND p.tier IN ('mild', 'spicy')
  AND p.published = true
LIMIT 40;

-- Long Distance (premium): Connection + Playful + Fantasy + Curiosity mild+spicy, up to 40
INSERT INTO prompt_pack_items (pack_id, prompt_id, sort_order)
SELECT
  '22222222-0000-0000-0000-000000000003',
  p.id,
  (ROW_NUMBER() OVER (ORDER BY p.created_at) - 1)
FROM prompts p
JOIN categories c ON c.id = p.category_id
WHERE c.slug IN ('connection', 'playful', 'fantasy', 'curiosity')
  AND p.tier IN ('mild', 'spicy')
  AND p.published = true
LIMIT 40;

-- Lifestyle Intro (premium): all Lifestyle mild+spicy
INSERT INTO prompt_pack_items (pack_id, prompt_id, sort_order)
SELECT
  '22222222-0000-0000-0000-000000000005',
  p.id,
  (ROW_NUMBER() OVER (ORDER BY p.created_at) - 1)
FROM prompts p
JOIN categories c ON c.id = p.category_id
WHERE c.slug = 'lifestyle'
  AND p.tier IN ('mild', 'spicy')
  AND p.published = true;
