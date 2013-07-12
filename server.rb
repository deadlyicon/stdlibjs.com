require 'bundler/setup'
Bundler.require :default

require 'stdlibjs/spec_compiler'

class Server < Sinatra::Base

  set :root,          Bundler.root+'server'
  set :assets,        Sprockets::Environment.new(root)
  set :precompile,    [ /\w+\.(?!js|css).+/, /application.(css|js)$/ ]
  set :assets_prefix, '/assets'
  set :digest_assets, false
  set(:assets_path)   { File.join public_folder, assets_prefix }

  configure do
    %w{javascripts stylesheets images}.each do |type|
      assets.append_path "assets/#{type}"
      assets.append_path "vendor/assets/#{type}"
      assets.append_path Compass::Frameworks['bootstrap'].templates_directory + "/../vendor/assets/#{type}"
    end
    assets.append_path 'assets/font'

    Sprockets::Helpers.configure do |config|
      config.environment = assets
      config.prefix      = assets_prefix
      config.digest      = digest_assets
      config.public_path = public_folder
    end
    Sprockets::Sass.add_sass_functions = false

    set :haml, { :format => :html5 }
  end

  get '/' do
    haml :index
  end

  get '/build.js' do
    content_type 'application/javascript'
    compiler.source
  end

  get '/specs.js' do
    content_type 'application/javascript'
    spec_compiler.source
  end

  helpers do

    include Sprockets::Helpers

    def query_string
      request.env['QUERY_STRING'].gsub('=&', '&')
    end

    def libraries
      Stdlibjs.libraries
    end

    def selected_libraries
      (params.keys & libraries.to_a).to_set
    end

    def compiler
      @compiler ||= Stdlibjs::Compiler.new(
        libraries: selected_libraries,
        download_url: to(build_script_path),
      )
    end

    def spec_compiler
      @compiler ||= Stdlibjs::SpecCompiler.new(libraries: selected_libraries)
    end

    def resolved_libraries
      return Set.new if selected_libraries.empty?
      compiler.resolved_libraries
    end

    def build_script_path
      "/build.js?#{query_string}"
    end

    def specs_script_path
      "/specs.js?#{query_string}"
    end

    def edit_build_path
      "/?#{query_string}"
    end

  end

end
