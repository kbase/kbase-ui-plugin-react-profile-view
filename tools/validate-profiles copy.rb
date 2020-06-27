require './services'

$kbase_env = ENV['KBASE_ENV']
$kbase_token = ENV['KBASE_TOKEN']

# object_limit = ENV['OBJECT_LIMIT']
# if object_limit != nil
#     object_limit = object_limit.to_i
# end
# puts "ObjectLimit: #{object_limit}"

# indexer = RefdataIndexer.new
# indexer.index_workspace_objects object_limit: object_limit



def main()
    client = UserProfile.new $kbase_env, $kbase_token
    profiles = client.filter_users({filter: ''})
    puts "Hey, got #{profiles.length} users"
    profiles.each do |user| 
        username = user['username']
        # if username != 'eapearson'
        #     next
        # end
        # puts "Fetching profile for #{username}"
        user_profiles = client.get_user_profile([username])

        user_profile = user_profiles[0]

        # verify user
        if !user_profile.has_key? 'user'
            puts "ERROR - missing user key #{user_profile}"
            next
        end

        if !user_profile.has_key? 'profile'
            puts "ERROR - missing user key #{user_profile}"
            next
        end

        profile = user_profile['profile']

        # verify userdata
        next if profile == nil
        next if !profile.has_key? 'userdata'
        next if profile['userdata'] == {}
        next if profile['userdata'] == nil

        userdata = profile['userdata']


        # verify prefs

        # verify profile

        # verify affiliations

        # if user_profile['user']['username'] == 'eapearson'
            
        # end
        if userdata.has_key? 'affiliations'
            affiliations = userdata['affiliations']
            affiliations.each do |affiliation|
                started = affiliation['started']
                if started == nil
                    puts "started: NIL #{username}, #{affiliation}"
                elsif started.instance_of? String 
                    puts "started: STRING #{username}, #{affiliation}"
                else 
                    # puts "#{username}, #{started}, #{started.class}"
                end
                ended = affiliation['ended']
                if ended == nil
                    puts "ended: NIL #{username}, #{affiliation}"
                elsif started.instance_of? String 
                    puts "ended: STRING #{username}, #{affiliation}"
                else 
                    # puts "#{username}, #{started}, #{started.class}"
                end
            end
        end
        
    end
    
end

main

# puts client.get_user_profile ['eapearson']